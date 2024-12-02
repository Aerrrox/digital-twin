from django.contrib import admin
from rest_framework.authtoken.models import TokenProxy

from .models import User
from .admin_custom import CustomUserAdmin

admin.site.register(User, CustomUserAdmin)

admin.site.unregister(TokenProxy)