from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Order
from .serializers import OrderSerializer
import stripe
import logging

# Set Stripe secret key
stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)

# 🔹 GET and CREATE orders (local database)
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
        else:
            logger.error(f"Order creation failed: {serializer.errors}")
            print(f"Order creation failed: {serializer.errors}")  # also print to console
            return Response(serializer.errors, status=400)


# 🔹 Retrieve, Update, Delete specific order
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
        else:
            logger.error(f"Order update failed: {serializer.errors}")
            print(f"Order update failed: {serializer.errors}")  # also print to console
            return Response(serializer.errors, status=400)


# 🔹 Stripe Checkout Session
class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart_items = request.data.get('items', [])

        # Format for Stripe line_items
        line_items = []
        for item in cart_items:
            try:
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': item['name'],
                        },
                        'unit_amount': int(item['price'] * 100),  # Stripe uses cents
                    },
                    'quantity': item['quantity'],
                })
            except KeyError as e:
                error_msg = f"Missing key in item: {e}"
                logger.error(error_msg)
                print(error_msg)
                return Response({'error': 'Missing item name or price.'}, status=400)

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                customer_email=request.user.email,
                success_url='http://localhost:3000/success',
                cancel_url='http://localhost:3000/cancel',
            )
            return Response({'id': session.id})
        except Exception as e:
            logger.error(f"Stripe checkout session creation failed: {str(e)}")
            print(f"Stripe checkout session creation failed: {str(e)}")
            return Response({'error': str(e)}, status=500)
