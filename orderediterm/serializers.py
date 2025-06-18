from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'status_display', 'total_price', 'items']
        read_only_fields = ['created_at', 'total_price']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        total = 0
        for item in items_data:
            product = item['product']
            price = item['price']
            quantity = item['quantity']
            OrderItem.objects.create(order=order, product=product, price=price, quantity=quantity)
            total += price * quantity

        order.total_price = total
        order.save()
        return order
