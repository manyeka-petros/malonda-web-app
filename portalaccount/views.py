from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import User
from .serializers import UserSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
import logging

logger = logging.getLogger(__name__)


# SIGNUP: Make every new user a customer by default
class SignUpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data.copy()
        data['role'] = 'customer'  # default role

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        logger.error("Registration error: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LOGIN
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })

        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# LOGOUT
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Logout successful"},
                status=status.HTTP_205_RESET_CONTENT
            )

        except TokenError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception as e:
            return Response(
                {"detail": "Logout failed: " + str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ✅ NEW: List all users (both managers and customers)
class UsersListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


# ✅ Customers only list
class CustomersListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        customers = User.objects.filter(role='customer')
        serializer = UserSerializer(customers, many=True)
        return Response(serializer.data)


# ✅ Stats: Total customers, managers, and users
class UserStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_customers = User.objects.filter(role='customer').count()
        total_managers = User.objects.filter(role='manager').count()
        total_users = User.objects.count()
        return Response({
            "total_customers": total_customers,
            "total_managers": total_managers,
            "total_users": total_users,
        })


# ✅ NEW: Assign roles (Admin/Manager only)
class AssignRoleView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        role = request.data.get("role")

        if role not in ["customer", "manager"]:
            return Response(
                {"detail": "Invalid role. Allowed: 'customer' or 'manager'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(pk=pk)
            user.role = role
            user.save()
            return Response({
                "detail": f"Role updated to {role}",
                "user": UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
