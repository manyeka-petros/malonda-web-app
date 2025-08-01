from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()
    product_price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_image',
            'quantity',
            'price',          # price at order time (can differ from product_price)
            'product_price'   # current price of product
        ]
        read_only_fields = ['price', 'product_name', 'product_image', 'product_price']

    def get_product_image(self, obj):
        request = self.context.get('request')
        image_url = ''
        if obj.product and getattr(obj.product, 'image', None):
            image_url = obj.product.image.url
        if request and image_url:
            return request.build_absolute_uri(image_url)
        return image_url


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'user_email',
            'created_at',
            'status',
            'total_price',
            'items'
        ]
        read_only_fields = ['id', 'created_at', 'user', 'user_email', 'total_price']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must include at least one item.")
        for item in value:
            if item.get('quantity', 0) <= 0:
                raise serializers.ValidationError("Quantity must be greater than zero.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        user = request.user if request else None

        # Create the order linked to the current user
        order = Order.objects.create(user=user)

        total = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            price = product.price  # snapshot price

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )
            total += price * quantity

        order.total_price = total
        order.save()

        return order


class RecentOrderSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()
    amount = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'created_at', 'amount', 'status']

    def get_customer(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
