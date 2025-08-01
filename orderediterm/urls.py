from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    ManagerOrderListView,
    ManagerDashboardView,
)

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('manager/orders/', ManagerOrderListView.as_view(), name='manager-orders'),
    path('manager/dashboard/', ManagerDashboardView.as_view(), name='manager-dashboard'),
]
