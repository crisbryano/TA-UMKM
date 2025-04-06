// Main JavaScript for Martabak MSME Website

// Cart functionality using js-cookie
$(document).ready(function() {
    // Initialize cart from cookies or create empty cart
    let cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
    updateCartCount();

    // Add to cart function
    window.addToCart = function(productId, productName, price, image) {
        if (!cart[productId]) {
            cart[productId] = {
                id: productId,
                name: productName,
                price: price,
                image: image,
                quantity: 0
            };
        }
        
        cart[productId].quantity += 1;
        saveCart();
        
        // Show notification
        showNotification(`${productName} added to cart!`);
    };

    // Remove from cart function
    window.removeFromCart = function(productId) {
        if (cart[productId]) {
            delete cart[productId];
            saveCart();
        }
    };

    // Update cart quantity function
    window.updateCartQuantity = function(productId, quantity) {
        if (cart[productId]) {
            if (quantity <= 0) {
                delete cart[productId];
            } else {
                cart[productId].quantity = quantity;
            }
            saveCart();
        }
    };

    // Save cart to cookie
    function saveCart() {
        Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
        updateCartCount();
    }

    // Update cart count in navbar
    function updateCartCount() {
        let count = 0;
        for (const id in cart) {
            count += cart[id].quantity;
        }
        $('#cart-count').text(count);
    }

    // Show notification
    function showNotification(message) {
        // Create notification element if it doesn't exist
        if ($('#notification').length === 0) {
            $('body').append('<div id="notification" class="position-fixed top-0 end-0 p-3" style="z-index: 1050;"></div>');
        }
        
        // Create toast
        const toastId = 'toast-' + Date.now();
        const toast = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Martabak MSME</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        // Add toast to notification container
        $('#notification').append(toast);
        
        // Initialize and show toast
        const toastElement = new bootstrap.Toast(document.getElementById(toastId));
        toastElement.show();
        
        // Remove toast after it's hidden
        $(`#${toastId}`).on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }

    // Get cart items for cart page
    window.getCartItems = function() {
        return cart;
    };

    // Calculate cart total
    window.getCartTotal = function() {
        let total = 0;
        for (const id in cart) {
            total += cart[id].price * cart[id].quantity;
        }
        return total.toFixed(2);
    };

    // Clear cart
    window.clearCart = function() {
        cart = {};
        saveCart();
    };
});
s