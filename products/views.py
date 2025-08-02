from django.shortcuts import get_object_or_404
from django.db.models import Sum, F
from django.contrib.auth import get_user_model
from datetime import datetime
from calendar import month_name
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, parsers
from rest_framework.permissions import IsAuthenticated

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from orderediterm.models import Order, OrderItem
from orderediterm.serializers import RecentOrderSerializer

User = get_user_model()


# ----------------- CATEGORY VIEWS ------------------

class CategoryListCreateView(APIView):
    """
    GET: List all categories (NO authentication required).
    POST: Create a new category.
    """
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    """
    GET: Retrieve details of a category by ID (NO authentication required).
    PUT: Update a category (protected).
    DELETE: Delete a category (protected).
    """
    def get_object(self, pk):
        return get_object_or_404(Category, pk=pk)

    def get(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ----------------- PRODUCT VIEWS ------------------

class ProductListCreateView(APIView):
    """
    GET: List all products (NO authentication required).
    POST: Create a new product.
    """
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.save()
            return Response(ProductSerializer(product, context={'request': request}).data,
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    """
    GET: Retrieve product details by ID (NO authentication required).
    PUT: Update a product by ID (protected).
    DELETE: Delete a product by ID (protected).
    """
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_object(self, pk):
        return get_object_or_404(Product, pk=pk)

    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product, data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.save()
            return Response(ProductSerializer(product, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ----------------- GET ALL PRODUCTS & CATEGORIES (NO AUTH) ------------------

class GetAllProductsView(APIView):
    """GET: Return all products without authentication."""
    authentication_classes = []  # Disable global authentication
    permission_classes = [AllowAny]
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllCategoriesView(APIView):
    """GET: Return all categories without authentication."""
    authentication_classes = []  # Disable global authentication
    permission_classes = [AllowAny]
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# ----------------- MANAGER DASHBOARD VIEW ------------------

class ManagerDashboardView(APIView):
    """
    Provides summary statistics for managers/admins (Protected).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['manager', 'admin']:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        total_products = Product.objects.count()
        total_categories = Category.objects.count()
        total_orders = Order.objects.count()
        total_customers = User.objects.filter(role='customer').count()
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0

        current_month = datetime.now().month
        current_year = datetime.now().year
        sales_by_month_qs = (
            Order.objects.filter(created_at__year=current_year)
            .annotate(month=F('created_at__month'))
            .values('month')
            .annotate(monthly_sales=Sum('total_price'))
            .order_by('month')
        )

        sales_labels = []
        sales_data = []
        for i in range(6):
            month_num = ((current_month - 5 + i - 1) % 12) + 1
            sales_labels.append(month_name[month_num][:3])
            monthly_sales = next((item['monthly_sales'] for item in sales_by_month_qs if item['month'] == month_num), 0)
            sales_data.append(float(monthly_sales or 0))

        revenue_by_cat_qs = (
            OrderItem.objects
            .select_related('product__category')
            .values('product__category__name')
            .annotate(revenue=Sum(F('quantity') * F('price')))
            .order_by('-revenue')
        )
        revenue_labels = [item['product__category__name'] or 'Uncategorized' for item in revenue_by_cat_qs]
        revenue_data = [float(item['revenue']) for item in revenue_by_cat_qs]

        recent_orders_qs = Order.objects.select_related('user').order_by('-created_at')[:5]
        recent_orders = RecentOrderSerializer(recent_orders_qs, many=True).data

        top_products_qs = (
            OrderItem.objects
            .values('product__name')
            .annotate(
                sales=Sum('quantity'),
                revenue=Sum(F('quantity') * F('price'))
            )
            .order_by('-sales')[:5]
        )
        top_products = [
            {
                "name": item['product__name'],
                "sales": item['sales'],
                "revenue": float(item['revenue']),
            } for item in top_products_qs
        ]

        return Response({
            "totalProducts": total_products,
            "totalCategories": total_categories,
            "totalOrders": total_orders,
            "totalCustomers": total_customers,
            "totalSales": float(total_sales),
            "salesChart": {
                "labels": sales_labels,
                "data": sales_data
            },
            "revenueByCategory": {
                "labels": revenue_labels,
                "data": revenue_data
            },
            "recentOrders": recent_orders,
            "topProducts": top_products
        })
