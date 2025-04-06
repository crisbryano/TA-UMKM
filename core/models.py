from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_seller = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username}'s profile"

from django.conf import settings
from django.db import models
from django.apps import apps

class Settings(models.Model):
    site_name = models.CharField(max_length=100, default="Martabak MSME")
    contact_email = models.EmailField(default="contact@martabak-msme.com")
    contact_phone = models.CharField(max_length=20, default="+62 123 456 7890")
    address = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name_plural = 'Settings'
    
    def __str__(self):
        return self.site_name
    
    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
