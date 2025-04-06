from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Product, Category

def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(stock__gt=0)
    
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    
    return render(request, 'products/product_list.html', {
        'category': category,
        'categories': categories,
        'products': products
    })

def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug, stock__gt=0)
    return render(request, 'products/product_detail.html', {'product': product})
