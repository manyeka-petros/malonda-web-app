from django.urls import path
from .views import InitiatePaymentView, VerifyPaymentView, PayChanguWebhookView

urlpatterns = [
    path('payments/initiate/', InitiatePaymentView.as_view(), name='payment-initiate'),
    path('payments/verify/<str:tx_ref>/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('payments/webhook/', PayChanguWebhookView.as_view(), name='payment-webhook'),
]
