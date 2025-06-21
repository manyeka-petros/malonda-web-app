from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Cart, Wishlist
from .serializers import CartSerializer, WishlistSerializer

# 🛒 CART VIEWS

class CartListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart_items = Cart.objects.filter(user=request.user)
        serializer = CartSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Associate the user correctly
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CartDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        cart_item = get_object_or_404(Cart, id=pk, user=request.user)
        cart_item.delete()
        return Response({'detail': 'Item removed from cart'}, status=204)

# ❤️ WISHLIST VIEWS

class WishlistListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WishlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Correct user association
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class WishlistDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        item = get_object_or_404(Wishlist, id=pk, user=request.user)
        item.delete()
        return Response({'detail': 'Item removed from wishlist'}, status=204)
