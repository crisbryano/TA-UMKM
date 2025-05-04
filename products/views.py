from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Product, Category

def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(stock__gt=0)
    
    # Apply category filter if category_slug is provided
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    
    # Apply price filter if min_price or max_price is provided
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    
    if min_price:
        try:
            products = products.filter(price__gte=float(min_price))
        except (ValueError, TypeError):
            pass
    
    if max_price:
        try:
            products = products.filter(price__lte=float(max_price))
        except (ValueError, TypeError):
            pass
    
    # Apply sorting
    sort_param = request.GET.get('sort')
    if sort_param:
        if sort_param.startswith('-'):
            # Descending order
            products = products.order_by(sort_param)
        else:
            # Ascending order
            products = products.order_by(sort_param)
    
    return render(request, 'products/product_list.html', {
        'category': category,
        'categories': categories,
        'products': products
    })


def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug, stock__gt=0)
    return render(request, 'products/product_detail.html', {'product': product})
