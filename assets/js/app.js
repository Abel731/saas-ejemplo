// assets/js/app.js
// Responsabilidad: orquestar. Pedir productos → crear tarjetas → mostrarlas.

/**
 * Busca el contenedor, lo vacía, y mete una tarjeta por cada producto.
 * @param {Array} products
 */
function renderProducts(products) {
  const container = document.getElementById('products-container');

  if (!products || products.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No hay productos disponibles por el momento.</p>';
    return;
  }

  container.innerHTML = products.map(createProductCard).join('');
}

// Filtro de categorías — sigue leyendo data-category, que ahora viene
// de product.category en vez de estar escrito a mano en el HTML.
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
  const products = await getProducts(RESTAURANT_ID);
  console.log('Productos recibidos:', products);
  renderProducts(products);
});