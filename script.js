// script.js
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const cancelOrderBtn = document.getElementById('cancel-order');
    const submitOrderBtn = document.getElementById('submit-order');
    const successMessage = document.getElementById('success-message');
    
    let cart = [];
    
    // Open cart modal
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Close cart modal
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        checkoutForm.style.display = 'none';
        successMessage.style.display = 'none';
        checkoutBtn.style.display = 'block';
    });
    
    // Close when clicking on overlay
    overlay.addEventListener('click', function() {
        cartModal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        checkoutForm.style.display = 'none';
        successMessage.style.display = 'none';
        checkoutBtn.style.display = 'block';
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = button.getAttribute('data-id');
            const title = button.getAttribute('data-title');
            const price = parseInt(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    title,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCart();
            
            cartCount.style.transform = 'scale(1.5)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
            
            showNotification(`${title} telah ditambahkan ke keranjang`);
        });
    });
    
    // Checkout button click handler
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            checkoutForm.style.display = 'block';
            checkoutBtn.style.display = 'none';
        }
    });
    
    // Cancel order button
    cancelOrderBtn.addEventListener('click', function() {
        checkoutForm.style.display = 'none';
        successMessage.style.display = 'none';
        checkoutBtn.style.display = 'block';
    });
    
    // Submit order button
submitOrderBtn.addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    if (!name || !email || !phone || !address) {
        alert('Harap lengkapi semua data pemesanan!');
        return;
    }
    
    checkoutForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    const orderSummary = {
        customer: { name, email, phone, address },
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toISOString(),
        orderId: 'ORD-' + Math.floor(Math.random() * 1000000)
    };
    
    // Simpan pesanan ke localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.unshift(orderSummary); // Tambahkan pesanan baru di awal array
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Kosongkan keranjang
    localStorage.removeItem('cart');
    
    setTimeout(() => {
        cart = [];
        updateCart();
        successMessage.style.display = 'none';
        checkoutBtn.style.display = 'none';
        
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('address').value = '';
    }, 5000);
});
    
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang belanja Anda kosong</p>
                </div>
            `;
            checkoutBtn.style.display = 'none';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">Jumlah: ${item.quantity}</div>
                        <div class="cart-item-remove" data-id="${item.id}">Hapus</div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = this.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== itemId);
                    updateCart();
                });
            });
            
            checkoutBtn.style.display = 'block';
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Rp ${total.toLocaleString()}`;
        cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#2ecc71';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.animation = 'fadeIn 0.3s';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);
});