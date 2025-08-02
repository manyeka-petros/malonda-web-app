from django.urls import path
from .views import (
    SignUpView,
    LoginView,
    LogoutView,
    CustomersListView,
    UserStatsView,
    AssignRoleView
)

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),

    # Customers & Users
    path("customers/", CustomersListView.as_view(), name="customers"),
    path("user-stats/", UserStatsView.as_view(), name="user-stats"),

    # ✅ New: Update user role (Managers/Admins only)
    path("users/<int:pk>/update-role/", AssignRoleView.as_view(), name="update-user-role"),
]
