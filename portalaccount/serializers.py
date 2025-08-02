from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(read_only=True)  # Can't set role during signup

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        """Ensure all newly registered users are customers by default."""
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.role = 'customer'  # Default role
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        data['user'] = user
        return data


# ✅ Optional: Serializer to update roles (for managers/admins)
class UpdateUserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role']
