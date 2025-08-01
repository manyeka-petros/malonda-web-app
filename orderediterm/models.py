from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('paid', 'Paid'),          # Added for payment success
        ('failed', 'Failed'),      # Added for payment failure
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"

    def calculate_total(self):
        return sum(item.quantity * item.price for item in self.items.all())

    def save(self, *args, **kwargs):
        # On first save, save to get pk
        if not self.pk:
            super().save(*args, **kwargs)
        # Update total_price after related items exist
        new_total = self.calculate_total()
        if self.total_price != new_total:
            self.total_price = new_total
            super().save(update_fields=['total_price'])
        else:
            # If total hasn't changed, no need to save again
            super().save(*args, **kwargs)

    def mark_as_paid(self):
        self.status = 'paid'
        self.save(update_fields=['status'])

    def mark_as_failed(self):
        self.status = 'failed'
        self.save(update_fields=['status'])


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name='order_items'
    )
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot of product price at order time

    def __str__(self):
        return f"{self.product.name if self.product else 'Unknown Product'} x {self.quantity}"

    def save(self, *args, **kwargs):
        # Auto-fill price from product if not set
        if self.product and not self.price:
            self.price = self.product.price
        super().save(*args, **kwargs)
        # After saving an item, update the order total_price
        if self.order:
            self.order.save(update_fields=['total_price'])
