async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const res = await fetch('/api/products');
  const products = await res.json();
  const product = products.find(p => p._id === id);

  const container = document.getElementById('productDetail');

  if (!product) {
    container.innerHTML = '<p class="empty-cart">Product not found.</p>';
    return;
  }

  container.innerHTML = `
    <div class="detail-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="detail-info">
      <h1>${product.name}</h1>
      <div class="detail-price">₹${product.price}</div>
      <p class="detail-desc">${product.description}</p>
      <p class="detail-stock">${product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}</p>
      <div class="qty-controls detail-qty">
        <button class="qty-btn" id="decreaseQty">−</button>
        <span id="detailQty">1</span>
        <button class="qty-btn" id="increaseQty">+</button>
      </div>
      <button class="add-btn" id="detailAddBtn">Add to Cart</button>
    </div>
  `;

  let qty = 1;
  document.getElementById('decreaseQty').addEventListener('click', () => {
    if (qty > 1) qty--;
    document.getElementById('detailQty').textContent = qty;
  });
  document.getElementById('increaseQty').addEventListener('click', () => {
    qty++;
    document.getElementById('detailQty').textContent = qty;
  });

  document.getElementById('detailAddBtn').addEventListener('click', () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    const btn = document.getElementById('detailAddBtn');
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('added');
    }, 1000);
  });
}

updateCartCount();
loadProductDetail();