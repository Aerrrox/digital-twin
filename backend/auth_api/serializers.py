from rest_framework import serializers
from django.db import models
from .models import User
from django.core.validators import EmailValidator 

class UserSerializer(serializers.ModelSerializer):
    password_conf = models.CharField(max_length=100, blank=False)
    email = models.EmailField(validators=[EmailValidator(message='Некорректный email')])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_conf']
        

    def validate_password(self, value):
        if value != self.initial_data.get('password_conf'):
            raise serializers.ValidationError('Пароли не совпадают')
        return value
    
    
    
    