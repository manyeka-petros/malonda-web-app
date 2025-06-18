# urls.py
from django.urls import path
from .views import (
    CartListCreateView, CartDeleteView,
    WishlistListCreateView, WishlistDeleteView
)

urlpatterns = [
    # 🛒 Cart
    path('cart/', CartListCreateView.as_view(), name='cart-list-create'),
    path('cart/<int:pk>/', CartDeleteView.as_view(), name='cart-delete'),

    # ❤️ Wishlist
    path('wishlist/', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('wishlist/<int:pk>/', WishlistDeleteView.as_view(), name='wishlist-delete'),
]
