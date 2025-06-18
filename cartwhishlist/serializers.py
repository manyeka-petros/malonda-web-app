# serializers.py
from rest_framework import serializers
from .models import Cart, Wishlist
from products.models import Product

class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'product_name', 'quantity', 'added_at']
        read_only_fields = ['added_at']


class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_name', 'added_at']
        read_only_fields = ['added_at']
