const defaultProducts = [
  { id: 1, name: 'Notebook Premium', price: 2599, category: 'Tecnologia', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80', description: 'Leve, rápido e ideal para estudos e trabalho.', badge: 'Mais vendido' },
  { id: 2, name: 'Cadeira Ergonômica', price: 899, category: 'Casa', image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80', description: 'Conforto e ajuste para longas horas.', badge: 'Recomendado' },
  { id: 3, name: 'Bola de Basquete', price: 159, category: 'Esporte', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80', description: 'Boa aderência e ótima para treinos.', badge: 'Promoção' }
];

const storageKeys = {
  products: 'lion-products',
  cart: 'lion-cart',
  favorites: 'lion-favorites',
  reviews: 'lion-reviews'
};

const posts = [
  { title: 'Notebook para programação', category: 'Tecnologia', text: 'Excelente bateria e desempenho para o dia a dia.' },
  { title: 'Cadeira para home office', category: 'Casa', text: 'Muito confortável para longas jornadas de estudo.' }
];

const defaultReviews = [
  { id: 1, name: 'Marta', rating: 5, comment: 'Produtos bem escolhidos e a comunidade ajuda a decidir rápido.' },
  { id: 2, name: 'Caio', rating: 4, comment: 'Gostei da ideia do carrinho e das recomendações em destaque.' }
];

let products = JSON.parse(localStorage.getItem(storageKeys.products)) || defaultProducts;
let cart = JSON.parse(localStorage.getItem(storageKeys.cart)) || [];
let favorites = JSON.parse(localStorage.getItem(storageKeys.favorites)) || [];
let reviews = JSON.parse(localStorage.getItem(storageKeys.reviews)) || defaultReviews;

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
const productForm = document.getElementById('productForm');
const productMessage = document.getElementById('productMessage');
const favoritesList = document.getElementById('favoritesList');
const featuredList = document.getElementById('featuredList');
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');
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

function saveProducts() {
  localStorage.setItem(storageKeys.products, JSON.stringify(products));
}

function saveCart() {
  localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
}

function saveFavorites() {
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
}

function saveReviews() {
  localStorage.setItem(storageKeys.reviews, JSON.stringify(reviews));
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

function renderFavorites() {
  if (!favoritesList) return;
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
  favoritesList.innerHTML = favoriteProducts.length
    ? favoriteProducts.map((product) => `
        <div class="favorite-item">
          <strong>${product.name}</strong>
          <span>${formatCurrency(product.price)}</span>
        </div>
      `).join('')
    : '<p>Nenhum favorito ainda.</p>';
}

function renderFeatured() {
  if (!featuredList) return;
  const featuredProducts = products.slice(0, 3);
  featuredList.innerHTML = featuredProducts.map((product) => `
    <div class="featured-item">
      <strong>${product.name}</strong>
      <span>${product.category}</span>
      <small>${formatCurrency(product.price)}</small>
    </div>
  `).join('');
}

function renderReviews() {
  if (!reviewsList) return;
  reviewsList.innerHTML = reviews.map((review) => `
    <article class="review-item">
      <div class="review-meta">
        <strong>${review.name}</strong>
        <span>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p>${review.comment}</p>
    </article>
  `).join('');
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
    saveFavorites();
    renderProducts();
    renderFavorites();
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

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const price = Number(document.getElementById('productPrice').value);
  const category = document.getElementById('productCategory').value.trim();
  const image = document.getElementById('productImage').value.trim();
  const description = document.getElementById('productDescription').value.trim();

  if (!name || !price || !category || !description) {
    productMessage.textContent = 'Preencha os campos obrigatórios.';
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    price,
    category,
    image: image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    description,
    badge: 'Novo'
  };

  products.unshift(newProduct);
  saveProducts();
  renderProducts();
  renderFeatured();
  renderFavorites();
  productForm.reset();
  productMessage.textContent = 'Produto cadastrado com sucesso!';
});

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('reviewName').value.trim();
  const rating = Number(document.getElementById('reviewRating').value);
  const comment = document.getElementById('reviewComment').value.trim();

  if (!name || !rating || !comment) return;

  reviews.unshift({ id: Date.now(), name, rating, comment });
  saveReviews();
  renderReviews();
  reviewForm.reset();
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
renderFavorites();
renderFeatured();
renderReviews();
