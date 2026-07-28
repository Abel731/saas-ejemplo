// assets/js/app.js — landing pública (index.html)

function renderProducts(products) {
  const container = document.getElementById('products-container');

  if (!products || products.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No hay productos disponibles por el momento.</p>';
    return;
  }

  container.innerHTML = products.map(createProductCard).join('');
}

function filterMenu(category, event) {
  const cards = document.querySelectorAll('.food-card');
  const buttons = document.querySelectorAll('.tab-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // La landing solo muestra productos marcados como disponibles
  const products = await getProducts(RESTAURANT_ID, { onlyAvailable: true });
  renderProducts(products);
});