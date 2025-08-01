from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Sum
from .models import Order
from .serializers import OrderSerializer
import logging

logger = logging.getLogger(__name__)


# ------------------- USER ORDER VIEWS ----------------------

class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = OrderSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            order = serializer.save()
            return Response(OrderSerializer(order, context={'request': request}).data, status=status.HTTP_201_CREATED)

        logger.error(f"Order creation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        logger.error(f"Order update failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        order.delete()
        return Response({'detail': 'Order deleted'}, status=status.HTTP_204_NO_CONTENT)


# ------------------- MANAGER/ADMIN VIEWS ----------------------

class ManagerOrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'role') or request.user.role not in ['manager', 'admin']:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)


class ManagerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'role') or request.user.role not in ['manager', 'admin']:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        total_orders = Order.objects.count()
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
        recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
        serializer = OrderSerializer(recent_orders, many=True, context={'request': request})

        dashboard_data = {
            'total_orders': total_orders,
            'total_sales': f"{total_sales:.2f}",
            'recent_orders': serializer.data
        }
        return Response(dashboard_data)
