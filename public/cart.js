function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    document.getElementById('cartTotal').textContent = '₹0';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>₹${item.price} each</p>
      </div>
      <div class="qty-controls">
        <button class="qty-btn minus">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn plus">+</button>
      </div>
      <button class="remove-btn">Remove</button>
    `;

    row.querySelector('.minus').addEventListener('click', () => changeQty(item._id, -1));
    row.querySelector('.plus').addEventListener('click', () => changeQty(item._id, 1));
    row.querySelector('.remove-btn').addEventListener('click', () => removeItem(item._id));

    container.appendChild(row);
  });

  document.getElementById('cartTotal').textContent = `₹${total}`;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(p => p._id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeItem(id);
    return;
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(p => p._id !== id);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to checkout.');
    window.location.href = '/login.html';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const payload = {
    products: cart.map(item => ({ product: item._id, quantity: item.quantity })),
    totalPrice: total
  };

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    localStorage.removeItem('cart');
    alert('Order placed successfully! 🎉');
    window.location.href = '/';
  } else {
    const data = await res.json();
    alert('Checkout failed: ' + data.error);
  }
});

updateCartCount();
renderCart();