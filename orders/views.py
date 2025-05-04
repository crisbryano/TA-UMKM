# orders/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from products.models import Product
from .models import Order, OrderItem
import json
import datetime 
import urllib

def cart_view(request):
    """View for displaying the shopping cart page"""
    return render(request, 'orders/cart.html')

@require_POST
def add_to_cart(request, product_id):
    """AJAX view for adding a product to the cart"""
    product = get_object_or_404(Product, id=product_id)
    
    if product.stock <= 0:
        return JsonResponse({
            'status': 'error',
            'message': 'Product is out of stock'
        })
    
    return JsonResponse({
        'status': 'success',
        'message': f'{product.name} added to cart'
    })

@require_POST
def remove_from_cart(request, product_id):
    """AJAX view for removing a product from the cart"""
    return JsonResponse({
        'status': 'success',
        'message': 'Item removed from cart'
    })

@require_POST
def update_cart(request, product_id):
    """AJAX view for updating the quantity of a product in the cart"""
    product = get_object_or_404(Product, id=product_id)
    quantity = int(request.POST.get('quantity', 1))
    
    if quantity <= 0:
        return JsonResponse({
            'status': 'error',
            'message': 'Quantity must be greater than zero'
        })
    
    if quantity > product.stock:
        return JsonResponse({
            'status': 'error',
            'message': f'Only {product.stock} items available'
        })
    
    return JsonResponse({
        'status': 'success',
        'message': 'Cart updated'
    })

@login_required
def checkout(request):
    """View for displaying the checkout page"""
    # Pre-fill form with user data if available
    initial_data = {}
    if hasattr(request.user, 'profile'):
        initial_data = {
            'full_name': request.user.get_full_name() or request.user.username,
            'email': request.user.email,
            'phone': request.user.profile.phone or '',
            'address': request.user.profile.address or '',
        }
    
    return render(request, 'orders/checkout.html', {'initial_data': initial_data})

@login_required
@require_POST
def place_order(request):
    """View for processing the order"""
    if request.method == 'POST':
        # Get form data
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        payment_method = request.POST.get('payment_method')
        
        # Validate form data
        if not all([full_name, email, phone, address]):
            messages.error(request, 'Please fill in all required fields')
            return redirect('checkout')
        
        # Get cart data from hidden field or cookie
        cart_items = request.POST.get('order_items')
        if cart_items:
            cart_items = json.loads(cart_items)
        else:
            # Fallback to cookie if hidden field is not available
            cart_cookie = request.COOKIES.get('cart', '{}')
            cart_cookie = urllib.parse.unquote(cart_cookie) if cart_cookie else '{}'
            cart_items = json.loads(cart_cookie)
        if not cart_items:
            messages.error(request, 'Your cart is empty')
            return redirect('cart')
        
        # Calculate total amount
        total_amount = 0
        for item_id, item_data in cart_items.items():
            product = get_object_or_404(Product, id=item_data['id'])
            quantity = item_data['quantity']
            
            # Validate stock
            if quantity > product.stock:
                messages.error(request, f'Only {product.stock} {product.name} available')
                return redirect('cart')
            
            total_amount += product.price * quantity
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            full_name=full_name,
            email=email,
            phone=phone,
            address=address,
            total_amount=total_amount,
            status='pending'
        )
        
        # Create order items and update stock
        for item_id, item_data in cart_items.items():
            product = get_object_or_404(Product, id=item_data['id'])
            quantity = item_data['quantity']
            
            # Create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )
            
            # Update product stock
            product.stock -= quantity
            product.save()
        
        # Send order confirmation email
        try:
            send_order_confirmation_email(order)
        except Exception as e:
            # Log the error but don't stop the order process
            print(f"Error sending email: {e}")
        
        # Redirect to order success page
        return redirect('order_success', order_id=order.id)
    
    return redirect('checkout')

def send_order_confirmation_email(order):
    """Send order confirmation email to customer"""
    subject = f'Order Confirmation - Order #{order.id}'
    
    # Render HTML email template
    html_message = render_to_string('emails/order_confirmation.html', {
        'order': order,
        'items': order.items.all(),
    })
    
    # Create plain text version
    plain_message = strip_tags(html_message)
    
    # Send email
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [order.email],
        html_message=html_message,
        fail_silently=False,
    )

@login_required
def order_success(request, order_id):
    """View for displaying the order success page"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'orders/order_success.html', {'order': order})

@login_required
def my_orders(request):
    """View for displaying the user's orders"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'orders/my_orders.html', {'orders': orders})

@login_required
def track_order(request, order_id):
    """View for tracking an order"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'orders/track_order.html', {'order': order})

# Payment processing functions
def process_cash_payment(order):
    """Process cash on delivery payment"""
    # For cash on delivery, we just mark the order as processing
    order.status = 'processing'
    order.save()
    return True

def process_bank_transfer(order, transaction_id=None):
    """Process bank transfer payment"""
    # For bank transfer, we would typically verify the transaction
    # For this implementation, we'll just mark it as processing
    order.status = 'processing'
    order.save()
    return True

@login_required
@require_POST
def verify_payment(request, order_id):
    """View for verifying payment (for bank transfers)"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    # Only allow verification for pending orders
    if order.status != 'pending':
        messages.error(request, 'This order cannot be verified')
        return redirect('track_order', order_id=order.id)
    
    # Get transaction details
    transaction_id = request.POST.get('transaction_id')
    payment_date = request.POST.get('payment_date')
    
    # Validate input
    if not transaction_id or not payment_date:
        messages.error(request, 'Please provide transaction ID and payment date')
        return redirect('track_order', order_id=order.id)
    
    # Process payment
    success = process_bank_transfer(order, transaction_id)
    
    if success:
        messages.success(request, 'Payment verification submitted. We will process your order shortly.')
    else:
        messages.error(request, 'Payment verification failed. Please try again or contact support.')
    
    return redirect('track_order', order_id=order.id)
