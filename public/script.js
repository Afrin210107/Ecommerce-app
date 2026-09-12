function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = totalItems;
  }
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item._id === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();

  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
  <a href="/product.html?id=${product._id}" class="img-wrap">
    <img src="${product.image}" alt="${product.name}">
  </a>
  <div class="product-info">
    <a href="/product.html?id=${product._id}" class="product-title-link"><h3>${product.name}</h3></a>
    <p>${product.description}</p>
    <div class="price">₹${product.price}</div>
    <button class="add-btn">Add to Cart</button>
  </div>
`;
  
    const btn = card.querySelector('.add-btn');
    btn.addEventListener('click', () => {
      addToCart(product);
      btn.textContent = 'Added ✓';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
      }, 1000);
    });
    grid.appendChild(card);
  });
}

updateCartCount();
loadProducts();