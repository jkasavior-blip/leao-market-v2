const cartItemsContainer = document.getElementById('cartItems');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentInfo = document.getElementById('paymentInfo');
const checkoutMessage = document.getElementById('checkoutMessage');

let cart = JSON.parse(localStorage.getItem('compare-cart')) || [];
let paymentMethod = 'pix';

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
    updatePaymentInfo();
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <article class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <p class="cart-meta">${item.category || 'Produto'} • ${item.store || 'Cadastrado'}</p>
        <p class="cart-item-meta">Fornecedor: ${item.supplier || 'Não informado'} • ${item.dropship ? 'Dropshipping' : 'Estoque próprio'}</p>
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

function updatePaymentInfo() {
  if (!paymentInfo) {
    return;
  }
  if (!cart.length) {
    paymentInfo.innerHTML = '';
    return;
  }
  if (paymentMethod === 'pix') {
    paymentInfo.innerHTML = `
      <strong>PIX selecionado</strong><br>
      Chave PIX: pagamento@compararcomprar.com<br>
      Copie a chave e conclua o pagamento no app do seu banco.`;
  } else {
    paymentInfo.innerHTML = `
      <strong>Boleto selecionado</strong><br>
      O código de boleto será gerado após finalizar a compra.`;
  }
}

function initializePaymentMethod() {
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  paymentRadios.forEach((radio) => {
    if (radio.checked) {
      paymentMethod = radio.value;
    }
    radio.addEventListener('change', (event) => {
      paymentMethod = event.target.value;
      updatePaymentInfo();
    });
  });
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

  const hasDropship = cart.some((item) => item.dropship);
  if (checkoutMessage) {
    checkoutMessage.textContent = paymentMethod === 'pix'
      ? 'Compra finalizada! Use a chave PIX acima para concluir o pagamento.'
      : 'Compra finalizada! O boleto será gerado automaticamente.';
  }

  if (paymentInfo) {
    paymentInfo.innerHTML = paymentMethod === 'pix'
      ? '<strong>PIX gerado</strong><br>Chave PIX: pagamento@compararcomprar.com'
      : '<strong>Boleto gerado</strong><br>Código: 23793.38127 60011.060072 49000.001445 1 89650000010000';
  }

  cart = [];
  saveCart();
  renderCart();
});

initializePaymentMethod();
renderCart();
