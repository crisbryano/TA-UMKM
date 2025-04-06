from django.contrib import admin
from .models import SalesData

@admin.register(SalesData)
class SalesDataAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_sales', 'total_orders')
