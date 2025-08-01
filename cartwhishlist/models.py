# your_app/models.py
from django.db import models
from products.models import Product, ProductImage
from portalaccount.models import User


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    image = models.ForeignKey(ProductImage, on_delete=models.SET_NULL, null=True, blank=True, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'product']

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

    def get_product_image_url(self):
        """
        Returns the selected product image URL, or falls back to the first image or a placeholder.
        """
        if self.image and self.image.image:
            return self.image.image.url
        first_image = self.product.images.first()
        if first_image and first_image.image:
            return first_image.image.url
        return "/static/images/placeholder.png"


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlist_items')
    image = models.ForeignKey(ProductImage, on_delete=models.SET_NULL, null=True, blank=True, related_name='wishlist_items')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'product']

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

    def get_product_image_url(self):
        """
        Returns the selected product image URL, or falls back to the first image or a placeholder.
        """
        if self.image and self.image.image:
            return self.image.image.url
        first_image = self.product.images.first()
        if first_image and first_image.image:
            return first_image.image.url
        return "/static/images/placeholder.png"
