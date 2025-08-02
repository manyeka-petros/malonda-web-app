from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from requests.exceptions import HTTPError, RequestException
import requests
from .models import Transaction
import uuid
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.utils.decorators import method_decorator


# PayChangu API Base URL
PAYCHANGU_BASE_URL = "https://api.paychangu.com"

# Include Bearer token with secret_key for authorization
HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": f"Bearer {settings.PAYCHANGU_SECRET_KEY}"
}


class InitiatePaymentView(APIView):
    """
    Initiate PayChangu Standard Checkout
    """
    def post(self, request):
        data = request.data
        print("Received payment initiation request:", data)

        tx_ref = str(uuid.uuid4())  # Unique transaction reference

        # Required fields
        amount = data.get("amount")
        email = data.get("email")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")

        if not amount or not email:
            return Response(
                {"error": "amount and email are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Build payload for PayChangu
        payload = {
            "amount": amount,
            "currency": data.get("currency", "MWK"),
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "callback_url": settings.PAYCHANGU_CALLBACK_URL,  # Webhook/Callback URL
            "return_url": settings.PAYCHANGU_RETURN_URL,      # URL user goes after payment
            "tx_ref": tx_ref,
            "customization": {
                "title": data.get("title", "Checkout"),
                "description": data.get("description", "PayChangu Payment"),
            },
            "meta": data.get("meta", {}),
        }

        try:
            response = requests.post(
                f"{PAYCHANGU_BASE_URL}/payment",
                json=payload,
                headers=HEADERS,
                timeout=10,
            )
            response.raise_for_status()
            resp_json = response.json()
            print("PayChangu response:", resp_json)

            if resp_json.get("status") == "success":
                # Save the transaction locally
                Transaction.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    tx_ref=tx_ref,
                    amount=amount,
                    currency=payload["currency"],
                    status="initiated",
                    description="Standard Checkout",
                )
                return Response(resp_json, status=status.HTTP_201_CREATED)

            return Response(resp_json, status=status.HTTP_400_BAD_REQUEST)

        except RequestException as e:
            print("Error initiating PayChangu:", str(e))
            return Response(
                {"error": "Payment initiation failed: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyPaymentView(APIView):
    """
    Verify payment using tx_ref
    """
    def get(self, request, tx_ref):
        print("Verifying transaction:", tx_ref)
        try:
            response = requests.get(
                f"{PAYCHANGU_BASE_URL}/transaction/{tx_ref}",
                headers=HEADERS,
                timeout=10,
            )
            response.raise_for_status()
            resp_data = response.json()
            print("PayChangu verification response:", resp_data)

            tx = Transaction.objects.filter(tx_ref=tx_ref).first()
            if not tx:
                return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

            data = resp_data.get("data", {})
            status_ = data.get("status")
            amount_paid = float(data.get("amount", 0))

            if status_ == "successful" and amount_paid >= float(tx.amount):
                tx.status = "successful"
                tx.save()
                return Response(resp_data, status=status.HTTP_200_OK)

            tx.status = "failed"
            tx.save()
            return Response({"error": "Transaction not successful"}, status=status.HTTP_400_BAD_REQUEST)

        except HTTPError as http_err:
            return Response({"error": f"HTTP error: {http_err}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class PayChanguWebhookView(APIView):
    """
    Handle PayChangu Webhook/Callback
    """
    def post(self, request):
        try:
            payload = json.loads(request.body)
            print("PayChangu webhook payload:", payload)

            tx_ref = payload.get("data", {}).get("tx_ref")
            status_ = payload.get("data", {}).get("status")

            if not tx_ref:
                return JsonResponse({"error": "Missing tx_ref"}, status=400)

            tx = Transaction.objects.filter(tx_ref=tx_ref).first()
            if not tx:
                return JsonResponse({"error": "Transaction not found"}, status=404)

            if status_ == "successful" and tx.status != "successful":
                tx.status = "successful"
                tx.save()
                print(f"Transaction {tx_ref} marked successful via webhook.")
            elif status_ == "failed":
                tx.status = "failed"
                tx.save()
                print(f"Transaction {tx_ref} marked failed via webhook.")

            return JsonResponse({"status": "received"})

        except Exception as e:
            print("Webhook error:", str(e))
            return JsonResponse({"error": str(e)}, status=500)
