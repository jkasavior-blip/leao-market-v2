const STORAGE_KEYS = {
  products: 'compare-products',
  cart: 'compare-cart',
  favorites: 'compare-favorites'
};

const initialProducts = [
  {
    id: 1,
    name: 'Notebook Ultralight',
    category: 'Tecnologia',
    price: 2599,
    rating: '4.8/5',
    badge: 'Mais vendido',
    emoji: '💻',
    store: 'Amazon',
    supplier: 'TechDropship',
    dropship: true,
    description: 'Leve, rápido e ideal para quem trabalha e estuda o dia todo.',
    highlights: ['Processador eficiente', 'Bateria de longa duração', 'Tela nítida para estudo e trabalho'],
    guarantee: 'Garantia de 12 meses e frete rápido.',
    link: 'https://www.amazon.com',
    reviews: [
      { author: 'Marta', text: 'Excelente para estudo e trabalho.', stars: 5 },
      { author: 'João', text: 'Bateria muito boa.', stars: 4 }
    ]
  },
  {
    id: 2,
    name: 'Cadeira Ergonomica',
    category: 'Casa',
    price: 899,
    rating: '4.6/5',
    badge: 'Recomendado',
    emoji: '🪑',
    store: 'Mercado Livre',
    supplier: 'HomeHub',
    dropship: false,
    description: 'Conforto e suporte para longas horas de estudo ou trabalho.',
    highlights: ['Encosto ajustável', 'Altura regulável', 'Ideal para home office'],
    guarantee: 'Entrega segura e apoio para montagem.',
    link: 'https://www.magazineluiza.com.br',
    reviews: [
      { author: 'Lia', text: 'Muito confortável.', stars: 5 }
    ]
  },
  {
    id: 3,
    name: 'Bola de Basquete',
    category: 'Esporte',
    price: 159,
    rating: '4.4/5',
    badge: 'Promoção',
    emoji: '🏀',
    store: 'Shopee',
    supplier: 'SportLink',
    dropship: true,
    description: 'Boa para treino e uso casual com excelente grip.',
    highlights: ['Material resistente', 'Boa aderência', 'Perfeita para treino e lazer'],
    guarantee: 'Troca simples e envio rápido.',
    link: 'https://www.netshoes.com.br',
    reviews: [
      { author: 'Pedro', text: 'Boa para treinos leves.', stars: 4 }
    ]
  },
  {
    id: 4,
    name: 'Fone Sem Fio',
    category: 'Tecnologia',
    price: 349,
    rating: '4.7/5',
    badge: 'Top review',
    emoji: '🎧',
    store: 'Amazon',
    supplier: 'AudioExpress',
    dropship: false,
    description: 'Som limpo, bateria longa e sem fio para o dia inteiro.',
    highlights: ['Conexão estável', 'Bateria para o dia todo', 'Som com excelente nitidez'],
    guarantee: 'Garantia de 6 meses e atendimento rápido.',
    link: 'https://www.amazon.com',
    reviews: [
      { author: 'Rita', text: 'Muito confortável.', stars: 5 }
    ]
  },
  {
    id: 5,
    name: 'Curso de Design UI',
    category: 'Digitais',
    price: 149,
    rating: '4.9/5',
    badge: 'Mais procurado',
    emoji: '🎨',
    store: 'Mercado Livre',
    supplier: 'EducaDropship',
    dropship: false,
    description: 'Aprenda interfaces modernas com aulas práticas e projeto final.',
    highlights: ['Aulas práticas', 'Projeto final para portfolio', 'Acesso imediato'],
    guarantee: 'Acesso vitalício e suporte para dúvidas.',
    link: 'https://www.coursera.org',
    reviews: [
      { author: 'Ana', text: 'Muito bom para começar.', stars: 5 }
    ]
  },
  {
    id: 6,
    name: 'Plano de Marketing Digital',
    category: 'Digitais',
    price: 89,
    rating: '4.5/5',
    badge: 'Novo',
    emoji: '📈',
    store: 'Shopee',
    supplier: 'DigitalWins',
    dropship: false,
    description: 'Modelo prático para criar estratégias de alcance e vendas online.',
    highlights: ['Estratégias prontas', 'Modelo de campanha', 'Fácil de adaptar'],
    guarantee: 'Arquivo digital entregue em até 24 horas.',
    link: 'https://www.udemy.com',
    reviews: [
      { author: 'Bruno', text: 'Prático e direto.', stars: 4 }
    ]
  }
];

const productsGrid = document.getElementById('productsGrid');
const productSearch = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const storeFilter = document.getElementById('storeFilter');
const fulfillmentFilter = document.getElementById('fulfillmentFilter');
const productForm = document.getElementById('productForm');
const productFormMessage = document.getElementById('productFormMessage');
const cartBtn = document.getElementById('cartBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const quickPanel = document.getElementById('quickPanel');
const quickPanelTitle = document.getElementById('quickPanelTitle');
const quickPanelContent = document.getElementById('quickPanelContent');
const closeQuickPanel = document.getElementById('closeQuickPanel');
const productModal = document.getElementById('productModal');
const productModalContent = document.getElementById('productModalContent');
const closeProductModal = document.getElementById('closeProductModal');

let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || initialProducts;
let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || [];
let favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites)) || [];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
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

function openProductModal(product) {
  if (!productModal || !productModalContent) {
    return;
  }
  productModalContent.innerHTML = `
    <div class="product-detail-header">
      <div>
        <p class="eyebrow">Detalhes do produto</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
      <div class="product-detail-price">${formatCurrency(product.price)}</div>
    </div>
    <div class="product-detail-list">
      ${product.highlights.map((item) => `<li>${item}</li>`).join('')}
    </div>
    <div class="product-supplier-info">
      <p><strong>Fornecedor:</strong> ${product.supplier || 'Não informado'}</p>
      <p><strong>Envio:</strong> ${product.dropship ? 'Dropshipping direto do fornecedor' : 'Estoque próprio / entrega rápida'}</p>
    </div>
    <p class="product-detail-guarantee">${product.guarantee}</p>
    <div class="product-detail-actions">
      <button class="btn btn-primary" type="button" data-action="cart" data-id="${product.id}">Adicionar ao carrinho</button>
      <a class="btn btn-secondary" href="${product.link}" target="_blank" rel="noopener noreferrer">Ver oferta</a>
    </div>
  `;
  productModal.classList.remove('hidden');
  productModal.setAttribute('aria-hidden', 'false');
}

function closeProductModalView() {
  if (!productModal) {
    return;
  }
  productModal.classList.add('hidden');
  productModal.setAttribute('aria-hidden', 'true');
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
    const product = products.find((item) => item.id === productId);
    if (product) {
      favorites.push(product);
    }
  }
  saveState();
  updateButtons();
  renderProducts();
}

function renderProducts() {
  const search = productSearch.value.toLowerCase();
  const category = categoryFilter.value;
  const store = storeFilter?.value || 'all';
  const fulfillment = fulfillmentFilter?.value || 'all';

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      (product.supplier || '').toLowerCase().includes(search) ||
      (product.store || 'Cadastrado').toLowerCase().includes(search);
    const matchesCategory = category === 'all' || product.category === category;
    const matchesStore = store === 'all' || (product.store || 'Cadastrado') === store;
    const matchesFulfillment =
      fulfillment === 'all' ||
      (fulfillment === 'dropship' && product.dropship) ||
      (fulfillment === 'stock' && !product.dropship);
    return matchesSearch && matchesCategory && matchesStore && matchesFulfillment;
  });

  productsGrid.innerHTML = '';

  if (!filtered.length) {
    productsGrid.innerHTML = '<div class="panel"><p>Nenhum produto encontrado para essa busca.</p></div>';
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'panel product-card';
    const imageUrl = product.category === 'Digitais'
      ? 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80'
      : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80';
    const isFavorite = favorites.some((item) => item.id === product.id);
    card.innerHTML = `
      <img class="product-image" src="${imageUrl}" alt="${product.name}" />
      <div class="product-emoji">${product.emoji}</div>
      <div class="product-badges">
        <span>${product.badge}</span>
        <span>${product.category}</span>
        <span>${product.store || 'Cadastrado'}</span>
      </div>
      <div class="product-labels">
        ${product.supplier ? `<span class="product-chip">Fornecedor: ${product.supplier}</span>` : ''}
        ${product.dropship ? '<span class="dropship-badge">Dropshipping</span>' : '<span class="product-chip">Em estoque</span>'}
      </div>
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
          <button class="btn btn-secondary" type="button" data-action="details" data-id="${product.id}">Ver detalhes</button>
        </div>
        <a class="btn btn-secondary" href="${product.link}" target="_blank" rel="noopener noreferrer">Ver oferta</a>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

if (productForm) {
  productForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = Number(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value.trim();
    const store = (document.getElementById('productStore').value.trim() || document.getElementById('productSource').value.trim() || 'Cadastrado').toString();
    const supplier = document.getElementById('productSupplier').value.trim() || 'Fornecedor não definido';
    const dropship = document.getElementById('productDropship').checked;
    const link = document.getElementById('productLink').value.trim();
    const description = document.getElementById('productDescription').value.trim();

    if (!name || !price || !category || !description) {
      productFormMessage.textContent = 'Preencha os campos obrigatórios.';
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      category,
      price,
      rating: '4.5/5',
      badge: 'Novo',
      emoji: '🛍️',
      store,
      supplier,
      dropship,
      description,
      highlights: ['Produto cadastrado pela comunidade', 'Disponível para comparação', 'Pode ser adicionado ao carrinho'],
      guarantee: dropship
        ? 'Entrega via fornecedor dropship, monitoramento simplificado.'
        : 'Validação local para teste do protótipo.',
      link: link || 'https://example.com',
      reviews: []
    };

    products.unshift(newProduct);
    saveState();
    renderProducts();
    productForm.reset();
    productFormMessage.textContent = 'Produto cadastrado com sucesso!';
  });
}

productsGrid.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) {
    return;
  }
  const action = target.dataset.action;
  const id = Number(target.dataset.id);
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }
  if (action === 'cart') {
    addToCart(product);
  }
  if (action === 'favorite') {
    toggleFavorite(id);
  }
  if (action === 'details') {
    openProductModal(product);
  }
});

productSearch.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
storeFilter?.addEventListener('change', renderProducts);
fulfillmentFilter?.addEventListener('change', renderProducts);
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
if (closeProductModal) {
  closeProductModal.addEventListener('click', closeProductModalView);
}
quickPanel?.addEventListener('click', (event) => {
  if (event.target === quickPanel) {
    closeQuickPanelView();
  }
});
productModal?.addEventListener('click', (event) => {
  if (event.target === productModal) {
    closeProductModalView();
  }
});
productModalContent?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="cart"]');
  if (!button) {
    return;
  }
  const id = Number(button.dataset.id);
  const product = products.find((item) => item.id === id);
  if (product) {
    addToCart(product);
    closeProductModalView();
  }
});

updateButtons();
renderProducts();
