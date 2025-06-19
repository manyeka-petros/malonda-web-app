from rest_framework import serializers
from .models import Cart, Wishlist
from products.models import Product


class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()
    product_price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'product_name', 'product_image', 'product_price', 'quantity', 'added_at']
        read_only_fields = ['added_at']

    def get_product_image(self, obj):
        request = self.context.get('request')
        image_url = obj.product.image.url if obj.product.image else ''
        if request and image_url:
            return request.build_absolute_uri(image_url)
        return image_url


class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_name', 'product_price', 'product_image', 'added_at']

    def get_product_image(self, obj):
        request = self.context.get('request')
        image_url = obj.product.image.url if obj.product.image else ''
        if request and image_url:
            return request.build_absolute_uri(image_url)
        return image_url
