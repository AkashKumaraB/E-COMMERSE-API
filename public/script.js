document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';

    // UI Elements
    const authSection = document.getElementById('auth-section');
    const productsSection = document.getElementById('products-section');
    const cartSection = document.getElementById('cart-section');
    const adminSection = document.getElementById('admin-section');
    const authStatus = document.getElementById('auth-status');
    const logoutBtn = document.getElementById('logout-btn');
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');

    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('user'));

    // Update UI based on auth state
    const updateUI = () => {
        if (token) {
            authSection.querySelector('#login-form').classList.add('hidden');
            authSection.querySelector('#register-form').classList.add('hidden');
            authStatus.textContent = `Logged in as ${user.name} (${user.role})`;
            logoutBtn.classList.remove('hidden');
            productsSection.classList.remove('hidden');
            cartSection.classList.remove('hidden');
            
            if (user.role === 'admin') {
                adminSection.classList.remove('hidden');
            }
            fetchProducts();
            fetchCart();
        } else {
            authSection.querySelector('#login-form').classList.remove('hidden');
            authSection.querySelector('#register-form').classList.remove('hidden');
            authStatus.textContent = 'Logged out';
            logoutBtn.classList.add('hidden');
            productsSection.classList.add('hidden');
            cartSection.classList.add('hidden');
            adminSection.classList.add('hidden');
        }
    };

    // --- API Fetch Functions ---

    // Register
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Registration successful! Please log in.');
                e.target.reset();
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });

    // Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                token = data.token;
                user = { name: data.name, role: data.role };
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                updateUI();
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', () => {
        token = null;
        user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateUI();
        productList.innerHTML = '';
        cartItems.innerHTML = '';
    });

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            productList.innerHTML = '';
            data.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <strong>${product.name}</strong> - $${product.price} <br>
                    <small>${product.description}</small> <br>
                    <button class="add-to-cart-btn" data-id="${product._id}">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        } catch (err) {
            alert(`Error fetching products: ${err.message}`);
        }
    };

    // Fetch Cart
    const fetchCart = async () => {
        try {
            const res = await fetch(`${API_URL}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const cartData = await res.json();
            cartItems.innerHTML = '';
            if (cartData.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty.</p>';
                return;
            }
            cartData.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <strong>${item.product.name}</strong> - Quantity: ${item.quantity}
                    <button class="remove-from-cart-btn" data-id="${item.product._id}">Remove</button>
                `;
                cartItems.appendChild(cartItemDiv);
            });
        } catch (err) {
            console.error(err);
        }
    };

    // Add to Cart
    productList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.id;
            try {
                const res = await fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId, quantity: 1 })
                });
                if (res.ok) {
                    alert('Item added to cart!');
                    fetchCart();
                } else {
                    const data = await res.json();
                    throw new Error(data.message);
                }
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    });
    
    // Remove from Cart
    cartItems.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = e.target.dataset.id;
            try {
                const res = await fetch(`${API_URL}/cart/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) {
                    alert('Item removed from cart!');
                    fetchCart();
                } else {
                    const data = await res.json();
                    throw new Error(data.message);
                }
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    });

    // Place Order
    document.getElementById('place-order-btn').addEventListener('click', async () => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Order placed successfully!');
                fetchCart(); // This will show an empty cart
            } else {
                const data = await res.json();
                throw new Error(data.message);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });
    
    // Admin: Add Product
    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const product = {
            name: document.getElementById('prod-name').value,
            category: document.getElementById('prod-category').value,
            price: document.getElementById('prod-price').value,
            description: document.getElementById('prod-desc').value,
            stock: document.getElementById('prod-stock').value,
        };
        
        try {
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(product)
            });
            
            if (res.ok) {
                alert('Product added successfully!');
                e.target.reset();
                fetchProducts();
            } else {
                const data = await res.json();
                throw new Error(data.message);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });


    // Initial UI setup
    updateUI();
});