// Cart functionality implementation for Martabak MSME Website

$(document).ready(function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Update cart count on page load
    updateCartCount();

    // Add to cart button click handler for product listing page
    $('.add-to-cart-btn').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        const productName = $(this).data('product-name');
        const productPrice = $(this).data('product-price');
        const productImage = $(this).data('product-image');
        
        addToCart(productId, productName, productPrice, productImage);
    });

    // Add to cart form submit handler for product detail page
    $('#add-to-cart-form').on('submit', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        const productName = $(this).data('product-name');
        const productPrice = $(this).data('product-price');
        const productImage = $(this).data('product-image');
        const quantity = parseInt($('#quantity').val());
        
        addToCartWithQuantity(productId, productName, productPrice, productImage, quantity);
    });

    // Quantity increment button
    $('.quantity-increment').on('click', function() {
        const input = $(this).siblings('.quantity-input');
        const currentValue = parseInt(input.val());
        input.val(currentValue + 1);
    });

    // Quantity decrement button
    $('.quantity-decrement').on('click', function() {
        const input = $(this).siblings('.quantity-input');
        const currentValue = parseInt(input.val());
        if (currentValue > 1) {
            input.val(currentValue - 1);
        }
    });

    // Cart page quantity update
    $('.cart-quantity-input').on('change', function() {
        const productId = $(this).data('product-id');
        const quantity = parseInt($(this).val());
        
        if (quantity > 0) {
            updateCartQuantity(productId, quantity);
            updateCartDisplay();
        } else {
            removeFromCart(productId);
            updateCartDisplay();
        }
    });

    // Remove from cart button
    $('.remove-from-cart-btn').on('click', function() {
        const productId = $(this).data('product-id');
        removeFromCart(productId);
        updateCartDisplay();
    });

    // Clear cart button
    $('#clear-cart-btn').on('click', function() {
        clearCart();
        updateCartDisplay();
    });

    // Function to add item to cart with quantity 1
    function addToCart(productId, productName, productPrice, productImage) {
        addToCartWithQuantity(productId, productName, productPrice, productImage, 1);
    }

    // Function to add item to cart with specified quantity
    function addToCartWithQuantity(productId, productName, productPrice, productImage, quantity) {
        // Get current cart from cookie or initialize empty cart
        let cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
        
        // Add or update product in cart
        if (cart[productId]) {
            cart[productId].quantity += quantity;
        } else {
            cart[productId] = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity
            };
        }
        
        // Save cart to cookie
        Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showNotification(`${productName} added to cart!`);
    }

    // Function to update cart count in navbar
    function updateCartCount() {
        const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
        let count = 0;
        
        for (const id in cart) {
            count += cart[id].quantity;
        }
        
        $('#cart-count').text(count);
    }

    // Function to update cart display on cart page
    function updateCartDisplay() {
        if ($('#cart-items-container').length) {
            const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
            const cartItemsContainer = $('#cart-items-container');
            
            if (Object.keys(cart).length === 0) {
                // Cart is empty
                cartItemsContainer.html(`
                    <div class="text-center py-5">
                        <i class="bi bi-cart4 fs-1 mb-3"></i>
                        <h4>Your cart is empty</h4>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <a href="/products/" class="btn btn-dark">Browse Products</a>
                    </div>
                `);
                $('#cart-summary').addClass('d-none');
            } else {
                // Cart has items
                let cartHtml = '';
                let subtotal = 0;
                
                for (const id in cart) {
                    const item = cart[id];
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;
                    
                    cartHtml += `
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" onerror="this.src='https://via.placeholder.com/100?text=${item.name}'">
                                    </div>
                                    <div class="col-md-4">
                                        <h5 class="card-title">${item.name}</h5>
                                        <p class="card-text">Rp ${item.price}</p>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="input-group">
                                            <button class="btn btn-outline-dark quantity-decrement" type="button">-</button>
                                            <input type="number" class="form-control text-center cart-quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
                                            <button class="btn btn-outline-dark quantity-increment" type="button">+</button>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <p class="fw-bold">Rp ${itemTotal}</p>
                                    </div>
                                    <div class="col-md-1">
                                        <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-product-id="${item.id}">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                cartItemsContainer.html(cartHtml);
                
                // Update cart summary
                $('#cart-summary').removeClass('d-none');
                $('#cart-subtotal').text(`Rp ${subtotal}`);
                $('#cart-total').text(`Rp ${subtotal}`);
                
                // Reinitialize event handlers for new elements
                $('.cart-quantity-input').on('change', function() {
                    const productId = $(this).data('product-id');
                    const quantity = parseInt($(this).val());
                    
                    if (quantity > 0) {
                        updateCartQuantity(productId, quantity);
                        updateCartDisplay();
                    } else {
                        removeFromCart(productId);
                        updateCartDisplay();
                    }
                });
                
                $('.remove-from-cart-btn').on('click', function() {
                    const productId = $(this).data('product-id');
                    removeFromCart(productId);
                    updateCartDisplay();
                });
                
                $('.quantity-increment').on('click', function() {
                    const input = $(this).siblings('.cart-quantity-input');
                    const productId = input.data('product-id');
                    const currentValue = parseInt(input.val());
                    const newValue = currentValue + 1;
                    
                    input.val(newValue);
                    updateCartQuantity(productId, newValue);
                    updateCartDisplay();
                });
                
                $('.quantity-decrement').on('click', function() {
                    const input = $(this).siblings('.cart-quantity-input');
                    const productId = input.data('product-id');
                    const currentValue = parseInt(input.val());
                    
                    if (currentValue > 1) {
                        const newValue = currentValue - 1;
                        input.val(newValue);
                        updateCartQuantity(productId, newValue);
                        updateCartDisplay();
                    }
                });
            }
        }
    }

    // Function to show notification
    function showNotification(message) {
        const toast = `
            <div class="toast align-items-center text-white bg-dark border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        // Add toast to body
        $('body').append(toast);
        
        // Initialize and show toast
        const toastElement = new bootstrap.Toast($('.toast').last(), {
            autohide: true,
            delay: 3000
        });
        toastElement.show();
        
        // Remove toast after it's hidden
        $('.toast').last().on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }

    // Initialize cart display on cart page
    if ($('#cart-items-container').length) {
        updateCartDisplay();
    }

    // Initialize checkout page
    if ($('#checkout-items-container').length) {
        const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
        
        if (Object.keys(cart).length === 0) {
            // Redirect to cart page if cart is empty
            window.location.href = '/cart/';
        } else {
            // Display checkout items
            let checkoutHtml = '';
            let subtotal = 0;
            
            for (const id in cart) {
                const item = cart[id];
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                checkoutHtml += `
                    <div class="d-flex justify-content-between mb-2">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>Rp ${itemTotal}</span>
                    </div>
                `;
            }
            
            $('#checkout-items-container').html(checkoutHtml);
            $('#checkout-subtotal').text(`Rp ${subtotal}`);
            $('#checkout-total').text(`Rp ${subtotal}`);
            
            // Add order items to hidden form field
            $('#order-items').val(JSON.stringify(cart));
            $('#order-total').val(subtotal);
        }
    }
});
