from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    CreateCheckoutSessionView,
    ConfirmOrderView,
    ManagerOrderListView,
    stripe_webhook,
)

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('confirm-order/', ConfirmOrderView.as_view(), name='confirm-order'),
    path('manager/orders/', ManagerOrderListView.as_view(), name='manager-orders'),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]
