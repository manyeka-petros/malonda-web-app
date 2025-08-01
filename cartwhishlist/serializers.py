from rest_framework import serializers
from .models import Cart, Wishlist


class ProductImageMixin:
    """
    Mixin to provide method for building absolute product image URL.
    """
    def get_product_image(self, obj):
        request = self.context.get('request')

        # Get the first related image from the product.images reverse relation
        first_image = obj.product.images.first()
        if first_image and first_image.image:
            image_url = first_image.image.url
            return request.build_absolute_uri(image_url) if request else image_url

        # Fallback placeholder
        return "/static/images/placeholder.png"


class CartSerializer(ProductImageMixin, serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()
    product_price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = Cart
        fields = [
            'id',
            'user',
            'product',
            'product_name',
            'product_image',
            'product_price',
            'quantity',
            'added_at',
        ]
        read_only_fields = ['user', 'added_at']


class WishlistSerializer(ProductImageMixin, serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = [
            'id',
            'user',
            'product',
            'product_name',
            'product_price',
            'product_image',
            'added_at',
        ]
        read_only_fields = ['user', 'added_at']
