const digitalProducts = [
  {
    id: 101,
    name: 'Curso de Design UI',
    price: 149,
    rating: '4.9/5',
    badge: 'Mais procurado',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    description: 'Aprenda a criar interfaces modernas e de alta conversão.',
    link: 'https://www.coursera.org',
    reviews: [
      { author: 'Nina', text: 'Muito didático e bem organizado.', stars: 5 }
    ]
  },
  {
    id: 102,
    name: 'Template de E-commerce',
    price: 79,
    rating: '4.7/5',
    badge: 'Novo',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    description: 'Modelo pronto para montar uma loja digital com excelente visual.',
    link: 'https://www.templatemonster.com',
    reviews: [
      { author: 'Caio', text: 'Bonito e fácil de adaptar.', stars: 4 }
    ]
  },
  {
    id: 103,
    name: 'Plano de Marketing Digital',
    price: 89,
    rating: '4.5/5',
    badge: 'Prático',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    description: 'Estratégias prontas para campanhas, alcance e conversão.',
    link: 'https://www.udemy.com',
    reviews: [
      { author: 'Dani', text: 'Bom para quem quer começar.', stars: 4 }
    ]
  }
];

const digitalProductsGrid = document.getElementById('digitalProductsGrid');
const digitalSearch = document.getElementById('digitalSearch');
const cartBtn = document.getElementById('cartBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const quickPanel = document.getElementById('quickPanel');
const quickPanelTitle = document.getElementById('quickPanelTitle');
const quickPanelContent = document.getElementById('quickPanelContent');
const closeQuickPanel = document.getElementById('closeQuickPanel');

let cart = JSON.parse(localStorage.getItem('compare-cart')) || [];
let favorites = JSON.parse(localStorage.getItem('compare-favorites')) || [];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function saveState() {
  localStorage.setItem('compare-cart', JSON.stringify(cart));
  localStorage.setItem('compare-favorites', JSON.stringify(favorites));
}

function updateButtons() {
  if (cartBtn) {
    cartBtn.textContent = `Carrinho (${cart.length})`;
  }
  if (favoritesBtn) {
    favoritesBtn.textContent = `Favoritos (${favorites.length})`;
  }
}

function openQuickPanel(title, content) {
  if (!quickPanel) {
    return;
  }
  quickPanelTitle.textContent = title;
  quickPanelContent.innerHTML = content;
  quickPanel.classList.remove('hidden');
  quickPanel.setAttribute('aria-hidden', 'false');
}

function closeQuickPanelView() {
  if (!quickPanel) {
    return;
  }
  quickPanel.classList.add('hidden');
  quickPanel.setAttribute('aria-hidden', 'true');
}

function addToCart(product) {
  cart.push(product);
  saveState();
  updateButtons();
  openQuickPanel('Carrinho', `<div class="quick-item">${product.name} adicionada ao carrinho.</div>`);
}

function toggleFavorite(productId) {
  const exists = favorites.some((item) => item.id === productId);
  if (exists) {
    favorites = favorites.filter((item) => item.id !== productId);
  } else {
    const product = digitalProducts.find((item) => item.id === productId);
    if (product) {
      favorites.push(product);
    }
  }
  saveState();
  updateButtons();
  renderDigitalProducts();
}

function renderDigitalProducts() {
  const search = digitalSearch.value.toLowerCase();
  const filtered = digitalProducts.filter((product) => {
    return product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search);
  });

  digitalProductsGrid.innerHTML = '';

  if (!filtered.length) {
    digitalProductsGrid.innerHTML = '<div class="panel"><p>Nenhum produto digital encontrado.</p></div>';
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'panel product-card';
    const isFavorite = favorites.some((item) => item.id === product.id);
    card.innerHTML = `
      <img class="product-image" src="${product.image}" alt="${product.name}" />
      <div class="product-badges"><span>${product.badge}</span><span>Digital</span></div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-price">${formatCurrency(product.price)}</div>
      <div class="review-box">
        <div class="review-summary">
          <span>Avaliações</span>
          <strong>${product.rating}</strong>
        </div>
        <ul class="review-list">
          ${product.reviews.map((review) => `<li><strong>${review.author}</strong> — ${'★'.repeat(review.stars)}<br>${review.text}</li>`).join('')}
        </ul>
      </div>
      <div class="product-actions">
        <div class="product-buttons">
          <button class="btn btn-secondary" type="button" data-action="favorite" data-id="${product.id}">${isFavorite ? '★ Favorito' : '☆ Favorito'}</button>
          <button class="btn btn-primary" type="button" data-action="cart" data-id="${product.id}">Adicionar</button>
        </div>
        <a class="btn btn-secondary" href="${product.link}" target="_blank" rel="noopener noreferrer">Ver oferta</a>
      </div>
    `;
    digitalProductsGrid.appendChild(card);
  });
}

digitalProductsGrid.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) {
    return;
  }
  const action = target.dataset.action;
  const id = Number(target.dataset.id);
  const product = digitalProducts.find((item) => item.id === id);
  if (!product) {
    return;
  }
  if (action === 'cart') {
    addToCart(product);
  }
  if (action === 'favorite') {
    toggleFavorite(id);
  }
});
digitalSearch.addEventListener('input', renderDigitalProducts);
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    const content = cart.length
      ? cart.map((item) => `<div class="quick-item">${item.name} — ${formatCurrency(item.price)}</div>`).join('')
      : '<div class="quick-item">Seu carrinho está vazio.</div>';
    openQuickPanel('Carrinho', content);
  });
}
if (favoritesBtn) {
  favoritesBtn.addEventListener('click', () => {
    const content = favorites.length
      ? favorites.map((item) => `<div class="quick-item">${item.name} — ${formatCurrency(item.price)}</div>`).join('')
      : '<div class="quick-item">Você ainda não marcou favoritos.</div>';
    openQuickPanel('Favoritos', content);
  });
}
if (closeQuickPanel) {
  closeQuickPanel.addEventListener('click', closeQuickPanelView);
}
quickPanel?.addEventListener('click', (event) => {
  if (event.target === quickPanel) {
    closeQuickPanelView();
  }
});
updateButtons();
renderDigitalProducts();
