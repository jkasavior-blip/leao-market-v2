const products = [
  { id: 1, name: 'Notebook Premium', price: 2599, category: 'Tecnologia', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80', description: 'Leve, rápido e ideal para estudos e trabalho.', badge: 'Mais vendido' },
  { id: 2, name: 'Cadeira Ergonômica', price: 899, category: 'Casa', image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80', description: 'Conforto e ajuste para longas horas.', badge: 'Recomendado' },
  { id: 3, name: 'Bola de Basquete', price: 159, category: 'Esporte', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80', description: 'Boa aderência e ótima para treinos.', badge: 'Promoção' }
];

const posts = [
  { title: 'Notebook para programação', category: 'Tecnologia', text: 'Excelente bateria e desempenho para o dia a dia.' },
  { title: 'Cadeira para home office', category: 'Casa', text: 'Muito confortável para longas jornadas de estudo.' }
];

let cart = JSON.parse(localStorage.getItem('lion-cart')) || [];
let favorites = JSON.parse(localStorage.getItem('lion-favorites')) || [];

const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const closeCart = document.getElementById('closeCart');
const loginButton = document.getElementById('loginButton');
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const saleValue = document.getElementById('saleValue');
const commissionValue = document.getElementById('commissionValue');
const registerSale = document.getElementById('registerSale');
const summaryText = document.getElementById('summaryText');

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function updateCartButton() {
  cartButton.textContent = `Carrinho (${cart.length})`;
}

function saveCart() {
  localStorage.setItem('lion-cart', JSON.stringify(cart));
}

function renderProducts() {
  productsGrid.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const isFavorite = favorites.includes(product.id);
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-badges"><span>${product.badge}</span><span>${product.category}</span></div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong>${formatCurrency(product.price)}</strong>
      <div class="product-actions">
        <button class="btn btn-secondary" data-action="favorite" data-id="${product.id}">${isFavorite ? '★ Favorito' : '☆ Favorito'}</button>
        <button class="btn btn-primary" data-action="cart" data-id="${product.id}">Adicionar</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

function renderPosts() {
  postsList.innerHTML = '';
  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
      <h3>${post.title}</h3>
      <div class="post-meta">${post.category}</div>
      <p>${post.text}</p>
    `;
    postsList.appendChild(card);
  });
}

function openCart() {
  cartItems.innerHTML = cart.length
    ? cart.map((item) => `<div class="cart-item"><span>${item.name}</span><strong>${formatCurrency(item.price)}</strong></div>`).join('')
    : '<p>Seu carrinho está vazio.</p>';
  cartPanel.classList.remove('hidden');
  cartPanel.setAttribute('aria-hidden', 'false');
}

function closeCartPanel() {
  cartPanel.classList.add('hidden');
  cartPanel.setAttribute('aria-hidden', 'true');
}

function openAuth() {
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
  authModal.classList.add('hidden');
  authModal.setAttribute('aria-hidden', 'true');
}

productsGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const id = Number(button.dataset.id);
  const product = products.find((item) => item.id === id);
  if (!product) return;
  if (button.dataset.action === 'cart') {
    cart.push(product);
    saveCart();
    updateCartButton();
    openCart();
  }
  if (button.dataset.action === 'favorite') {
    if (favorites.includes(id)) {
      favorites = favorites.filter((item) => item !== id);
    } else {
      favorites.push(id);
    }
    renderProducts();
  }
});

cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartPanel);
cartPanel.addEventListener('click', (event) => {
  if (event.target === cartPanel) closeCartPanel();
});
loginButton.addEventListener('click', openAuth);
closeAuth.addEventListener('click', closeAuthModal);
authModal.addEventListener('click', (event) => {
  if (event.target === authModal) closeAuthModal();
});

postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newPost = {
    title: document.getElementById('postTitle').value.trim(),
    category: document.getElementById('postCategory').value.trim(),
    text: document.getElementById('postComment').value.trim()
  };
  posts.unshift(newPost);
  renderPosts();
  postForm.reset();
});

registerSale.addEventListener('click', () => {
  const value = Number(saleValue.value || 0);
  const commission = value * 0.03;
  commissionValue.textContent = formatCurrency(commission);
  summaryText.textContent = `Venda registrada: ${formatCurrency(value)} com comissão de ${formatCurrency(commission)}.`;
});

updateCartButton();
renderProducts();
renderPosts();
