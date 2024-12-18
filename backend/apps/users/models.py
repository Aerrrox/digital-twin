from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField('username', max_length=100, unique=True, blank=False, null=False)
    email = models.EmailField('email', unique=True, blank=False, null=False)

    is_staff = models.BooleanField(
        'staff status',
        default=False,
        help_text='Designates whether the user can log into this admin site.',
    )
    is_active = models.BooleanField(
        'active',
        default=True,
        help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.',
    )
    date_joined = models.DateTimeField('date joined', auto_now_add=True)

    objects = CustomUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


    def __str__(self):
        return self.username
    
