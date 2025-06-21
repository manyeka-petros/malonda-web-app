from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Order
from .serializers import OrderSerializer
from portalaccount.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import stripe
import logging

# Stripe config
stripe.api_key = settings.STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)

# ------------------- ORDER VIEWS ----------------------
class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = OrderSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        logger.error(f"Order creation failed: {serializer.errors}")
        return Response(serializer.errors, status=400)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def delete(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        order.delete()
        return Response({'detail': 'Order deleted'}, status=204)

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        logger.error(f"Order update failed: {serializer.errors}")
        return Response(serializer.errors, status=400)


# ------------------- STRIPE CHECKOUT ----------------------
class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            items = request.data.get("items", [])
            user = request.user

            if not items:
                return Response({"error": "No items provided"}, status=400)

            line_items = []
            for item in items:
                if not all(k in item for k in ("name", "price", "quantity")):
                    return Response({"error": "Missing keys in item"}, status=400)

                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': item['name']},
                        'unit_amount': item['price'],
                    },
                    'quantity': item['quantity'],
                })

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:3000/cancel',
                metadata={
                    'user_id': str(user.id),
                    'username': user.username
                }
            )

            return Response({'id': session.id})

        except Exception as e:
            logger.error(f"Stripe checkout session creation failed: {str(e)}")
            return Response({'error': str(e)}, status=500)


class ConfirmOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'No session_id provided'}, status=400)

        try:
            session = stripe.checkout.Session.retrieve(session_id)
            user = request.user

            # Avoid duplicate order creation
            if Order.objects.filter(user=user, stripe_session_id=session_id).exists():
                return Response({'detail': 'Order already confirmed.'}, status=200)

            Order.objects.create(
                user=user,
                total_price=session['amount_total'] / 100,
                status='Paid',
                stripe_session_id=session_id
            )

            return Response({'detail': 'Order confirmed and saved.'}, status=201)

        except Exception as e:
            logger.error(f"Order confirmation error: {str(e)}")
            return Response({'error': str(e)}, status=500)


# ------------------- MANAGER VIEW ----------------------
class ManagerOrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if getattr(request.user, 'role', '') != 'manager':
            return Response({'detail': 'Unauthorized'}, status=403)

        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# ------------------- STRIPE WEBHOOK ----------------------
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        logger.warning("Stripe webhook signature verification failed.")
        return JsonResponse({'status': 'invalid'}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata'].get('user_id')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'status': 'user not found'}, status=404)

        # Avoid duplicate creation
        if not Order.objects.filter(stripe_session_id=session['id']).exists():
            Order.objects.create(
                user=user,
                total_price=session['amount_total'] / 100,
                status='Paid',
                stripe_session_id=session['id']
            )

    return JsonResponse({'status': 'success'}, status=200)
