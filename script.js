const STORAGE_KEYS = {
  users: 'comparar-users',
  posts: 'comparar-posts',
  activeUser: 'comparar-active-user',
  balance: 'comparar-balance',
  sales: 'comparar-sales',
  reviews: 'comparar-reviews'
};

const initialPosts = [
  {
    id: 1,
    author: 'Ana',
    title: 'Notebook leve para estudos',
    category: 'Tecnologia',
    product: 'Notebook 14"',
    price: 2499,
    link: 'https://www.amazon.com',
    comment: 'Muito bom para estudar, bateria confiável e ótimo peso.'
  },
  {
    id: 2,
    author: 'Carlos',
    title: 'Kit de escritório',
    category: 'Produtos de uso diário',
    product: 'Mesa + cadeira ergonômica',
    price: 899,
    link: 'https://www.magazineluiza.com.br',
    comment: 'Ajuda muito na rotina, principalmente para trabalho remoto.'
  }
];

let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [
  { name: 'Ana', email: 'ana@exemplo.com', password: '123456' }
];
let posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts)) || initialPosts;
let activeUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.activeUser));
let commissionBalance = Number(localStorage.getItem(STORAGE_KEYS.balance)) || 0;
let sales = JSON.parse(localStorage.getItem(STORAGE_KEYS.sales)) || [];
let reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.reviews)) || [
  { id: 1, name: 'Marta', rating: 5, comment: 'A comunidade ajuda muito a decidir com confiança.' },
  { id: 2, name: 'Caio', rating: 4, comment: 'Adorei a experiência de comparar produtos antes de comprar.' }
];

const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeModalBtn = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const mainRegisterForm = document.getElementById('mainRegisterForm');
const registerMessage = document.getElementById('registerMessage');
const saleValueInput = document.getElementById('saleValue');
const commissionValue = document.getElementById('commissionValue');
const registerSaleBtn = document.getElementById('registerSaleBtn');
const resetDemoBtn = document.getElementById('resetDemoBtn');
const postCount = document.getElementById('postCount');
const memberCount = document.getElementById('memberCount');
const commissionCount = document.getElementById('commissionCount');
const saleCount = document.getElementById('saleCount');
const lastCommission = document.getElementById('lastCommission');
const authTabs = document.querySelectorAll('.auth-tab');

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
  localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(activeUser));
  localStorage.setItem(STORAGE_KEYS.balance, String(commissionBalance));
  localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
  localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
}

function updateAuthUI() {
  if (loginBtn && registerBtn && logoutBtn) {
    const isLoggedIn = Boolean(activeUser);
    loginBtn.classList.toggle('hidden', isLoggedIn);
    registerBtn.classList.toggle('hidden', isLoggedIn);
    logoutBtn.classList.toggle('hidden', !isLoggedIn);

    if (activeUser) {
      loginBtn.textContent = `Olá, ${activeUser.name}`;
    } else {
      loginBtn.textContent = 'Entrar';
    }
  }
}

function renderPosts() {
  if (!postsList) {
    return;
  }

  postsList.innerHTML = '';

  if (!posts.length) {
    postsList.innerHTML = '<div class="post-card"><p>Nenhuma recomendação ainda. Seja o primeiro a postar.</p></div>';
    return;
  }

  posts.slice().reverse().forEach((post) => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
      <h4>${post.title}</h4>
      <div class="post-meta">
        <span>Por ${post.author}</span>
        <span>• ${post.category}</span>
        <span>• ${post.product}</span>
      </div>
      <p>${post.comment}</p>
      <div class="post-footer">
        <strong>R$ ${Number(post.price).toFixed(2)}</strong>
        <a class="btn btn-secondary" href="${post.link}" target="_blank" rel="noopener noreferrer">Ver oferta</a>
      </div>
    `;
    postsList.appendChild(card);
  });
}

function renderReviews() {
  if (!reviewsList) {
    return;
  }

  reviewsList.innerHTML = reviews.map((review) => `
    <article class="post-card">
      <div class="post-meta">
        <span><strong>${review.name}</strong></span>
        <span>• ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p>${review.comment}</p>
    </article>
  `).join('');
}

function renderStats() {
  if (postCount) {
    postCount.textContent = posts.length;
  }
  if (memberCount) {
    memberCount.textContent = users.length;
  }
  if (commissionCount) {
    commissionCount.textContent = formatCurrency(commissionBalance);
  }
  if (saleCount) {
    saleCount.textContent = sales.length;
  }
  if (lastCommission) {
    const lastSale = sales[sales.length - 1];
    lastCommission.textContent = lastSale ? formatCurrency(lastSale.commission) : formatCurrency(0);
  }
}

function openModal(mode = 'login') {
  if (!authModal) {
    return;
  }
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
  authTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  if (loginForm && registerForm) {
    loginForm.classList.toggle('hidden', mode !== 'login');
    registerForm.classList.toggle('hidden', mode !== 'register');
  }
}

function closeModal() {
  if (authModal) {
    authModal.classList.add('hidden');
    authModal.setAttribute('aria-hidden', 'true');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const foundUser = users.find((user) => user.email === email && user.password === password);

  if (foundUser) {
    activeUser = foundUser;
    saveState();
    updateAuthUI();
    closeModal();
    alert(`Bem-vindo, ${foundUser.name}!`);
  } else {
    alert('E-mail ou senha inválidos.');
  }
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  if (!name || !email || !password) {
    alert('Preencha todos os campos para criar a conta.');
    return;
  }

  const exists = users.some((user) => user.email === email);
  if (exists) {
    alert('Este e-mail já está cadastrado.');
    return;
  }

  const newUser = { name, email, password, interest: '' };
  users.push(newUser);
  activeUser = newUser;
  saveState();
  updateAuthUI();
  closeModal();
  alert(`Conta criada com sucesso, ${name}!`);
}

function handleMainRegister(event) {
  event.preventDefault();
  if (!mainRegisterForm || !registerMessage) {
    return;
  }

  const name = document.getElementById('mainRegisterName').value.trim();
  const email = document.getElementById('mainRegisterEmail').value.trim();
  const password = document.getElementById('mainRegisterPassword').value;
  const confirmPassword = document.getElementById('mainRegisterConfirmPassword').value;
  const interest = document.getElementById('mainRegisterInterest').value.trim();

  if (!name || !email || !password || !confirmPassword) {
    registerMessage.textContent = 'Preencha todos os campos obrigatórios.';
    return;
  }

  if (password !== confirmPassword) {
    registerMessage.textContent = 'As senhas precisam ser iguais.';
    return;
  }

  const exists = users.some((user) => user.email === email);
  if (exists) {
    registerMessage.textContent = 'Este e-mail já está cadastrado.';
    return;
  }

  const newUser = { name, email, password, interest };
  users.push(newUser);
  activeUser = newUser;
  saveState();
  updateAuthUI();
  mainRegisterForm.reset();
  registerMessage.textContent = `Conta criada com sucesso, ${name}!`;
}

if (reviewForm) {
  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const rating = Number(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();

    if (!name || !rating || !comment) {
      return;
    }

    reviews.unshift({ id: Date.now(), name, rating, comment });
    saveState();
    renderReviews();
    reviewForm.reset();
  });
}

if (postForm) {
  postForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!activeUser) {
    alert('É necessário entrar na conta para publicar.');
    openModal('login');
    return;
  }

  const newPost = {
    id: Date.now(),
    author: activeUser.name,
    title: document.getElementById('postTitle').value.trim(),
    category: document.getElementById('postCategory').value.trim(),
    product: document.getElementById('postProduct').value.trim(),
    price: Number(document.getElementById('postPrice').value),
    link: document.getElementById('postLink').value.trim(),
    comment: document.getElementById('postComment').value.trim()
  };

  posts.push(newPost);
  saveState();
  renderPosts();
  renderStats();
  postForm.reset();
  alert('Recomendação publicada com sucesso!');
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => openModal('login'));
}
if (registerBtn) {
  registerBtn.addEventListener('click', () => openModal('register'));
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    activeUser = null;
    saveState();
    updateAuthUI();
  });
}
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}
if (authModal) {
  authModal.addEventListener('click', (event) => {
    if (event.target === authModal) {
      closeModal();
    }
  });
}
authTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.mode;
    openModal(mode);
  });
});
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}
if (registerForm) {
  registerForm.addEventListener('submit', handleRegister);
}
if (mainRegisterForm) {
  mainRegisterForm.addEventListener('submit', handleMainRegister);
}
if (saleValueInput && commissionValue) {
  saleValueInput.addEventListener('input', () => {
    const value = Number(saleValueInput.value || 0);
    commissionValue.textContent = formatCurrency(value * 0.03);
  });
}
if (registerSaleBtn) {
  registerSaleBtn.addEventListener('click', () => {
    const value = Number(saleValueInput.value || 0);

    if (!value || value <= 0) {
      alert('Digite um valor maior que zero para registrar uma venda teste.');
      return;
    }

    const commission = value * 0.03;
    commissionBalance += commission;
    sales.push({ value, commission, date: new Date().toISOString() });
    saveState();
    renderStats();
    saleValueInput.value = '';
    commissionValue.textContent = formatCurrency(0);
    alert(`Venda registrada com sucesso. Comissão de ${formatCurrency(commission)} adicionada ao saldo simulado.`);
  });
}

if (resetDemoBtn) {
  resetDemoBtn.addEventListener('click', () => {
    commissionBalance = 0;
    sales = [];
    saveState();
    renderStats();
    alert('Demo de comissão resetada.');
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

updateAuthUI();
renderPosts();
renderStats();
