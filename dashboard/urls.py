from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('orders/', views.order_list, name='dashboard_orders'),
    path('orders/<int:order_id>/', views.order_detail, name='dashboard_order_detail'),
    path('orders/update-status/<int:order_id>/', views.update_order_status, name='update_order_status'),
    path('products/', views.product_list, name='dashboard_products'),
    path('products/add/', views.add_product, name='add_product'),
    path('products/edit/<int:product_id>/', views.edit_product, name='edit_product'),
    path('products/delete/<int:product_id>/', views.delete_product, name='delete_product'),
    path('customers/', views.customer_list, name='customer_list'),
    path('customers/export/', views.export_customers, name='export_customers'),
    path('sales/', views.sales_data, name='sales_data'),
]
