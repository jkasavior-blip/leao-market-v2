const cartItemsContainer = document.getElementById('cartItems');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutMessage = document.getElementById('checkoutMessage');

let cart = JSON.parse(localStorage.getItem('compare-cart')) || [];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function saveCart() {
  localStorage.setItem('compare-cart', JSON.stringify(cart));
}

function renderCart() {
  if (!cartItemsContainer) {
    return;
  }

  if (!cart.length) {
    cartItemsContainer.innerHTML = '<div class="panel empty-state"><p>Seu carrinho está vazio. Volte ao catálogo para adicionar produtos.</p></div>';
    updateSummary();
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <article class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <p class="cart-meta">${item.category}</p>
      </div>
      <div class="cart-item-actions">
        <strong>${formatCurrency(item.price)}</strong>
        <button class="btn btn-secondary" type="button" data-index="${index}">Remover</button>
      </div>
    </article>
  `).join('');

  updateSummary();
}

function updateSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;
  if (summarySubtotal) {
    summarySubtotal.textContent = formatCurrency(subtotal);
  }
  if (summaryTotal) {
    summaryTotal.textContent = formatCurrency(total);
  }
}

cartItemsContainer?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-index]');
  if (!button) {
    return;
  }
  const index = Number(button.dataset.index);
  cart.splice(index, 1);
  saveCart();
  renderCart();
});

checkoutBtn?.addEventListener('click', () => {
  if (!cart.length) {
    if (checkoutMessage) {
      checkoutMessage.textContent = 'Adicione produtos ao carrinho antes de finalizar.';
    }
    return;
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = 'Compra finalizada com sucesso! Em breve você receberá um e-mail de confirmação.';
  }
  cart = [];
  saveCart();
  renderCart();
});

renderCart();
