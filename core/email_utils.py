from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from orders.models import Order

def send_order_confirmation_email(order):
    """
    Send order confirmation email to customer
    
    Args:
        order: Order object
    """
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
    
    return True

def send_order_status_update_email(order):
    """
    Send order status update email to customer
    
    Args:
        order: Order object
    """
    subject = f'Order Status Update - Order #{order.id}'
    
    # Get status display name
    status_display = order.get_status_display()
    
    # Render HTML email template
    html_message = render_to_string('emails/order_status_update.html', {
        'order': order,
        'items': order.items.all(),
        'status': status_display,
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
    
    return True

def send_order_shipped_email(order):
    """
    Send order shipped email to customer
    
    Args:
        order: Order object
    """
    subject = f'Your Order Has Been Shipped - Order #{order.id}'
    
    # Render HTML email template
    html_message = render_to_string('emails/order_shipped.html', {
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
    
    return True

def send_order_delivered_email(order):
    """
    Send order delivered email to customer
    
    Args:
        order: Order object
    """
    subject = f'Your Order Has Been Delivered - Order #{order.id}'
    
    # Render HTML email template
    html_message = render_to_string('emails/order_delivered.html', {
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
    
    return True
