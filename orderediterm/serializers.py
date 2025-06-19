from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price']
        read_only_fields = ['price']

    def get_product_image(self, obj):
        request = self.context.get('request')
        image_url = obj.product.image.url if obj.product and obj.product.image else ''
        return request.build_absolute_uri(image_url) if request and image_url else image_url

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'total_price', 'items']
        read_only_fields = ['created_at', 'user', 'total_price']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(user=self.context['request'].user)

        total = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            price = product.price  # Get current product price

            total += price * quantity
            OrderItem.objects.create(order=order, product=product, quantity=quantity, price=price)

        order.total_price = total
        order.save()
        return order
