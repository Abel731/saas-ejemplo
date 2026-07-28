// assets/js/productCard.js
// Responsabilidad única: recibir un producto y devolver el HTML de su tarjeta.
// No toca el DOM. No hace fetch. No sabe que existe Supabase.

// Carpeta de imágenes según la categoría del producto.
// Si mañana agregan una categoría nueva, solo hay que sumar una línea acá.
const IMAGE_FOLDERS = {
  comidas: 'assets/images/comidas/',
  bebidas: 'assets/images/bebidas/',
};

/**
 * Arma la ruta completa de la imagen a partir de la categoría del producto.
 * Si la categoría no está mapeada, devuelve el image_url tal cual (por si
 * en el futuro pasa a ser una URL completa de Supabase Storage).
 */
function buildImagePath(product) {
  const folder = IMAGE_FOLDERS[product.category];
  if (!folder) return product.image_url;
  return folder + product.image_url;
}

/**
 * @param {Object} product - fila de la tabla `products`
 * @returns {string} HTML de una tarjeta .food-card
 */
function createProductCard(product) {
  const priceFormatted = Number(product.price).toLocaleString('es-PY');
  const waMessage = encodeURIComponent(`Hola, quisiera pedir ${product.name}`);
  const imagePath = buildImagePath(product);

  // El badge todavía no existe en la tabla (lo agregaremos más adelante
  // como columna `badge`). Mientras tanto, si no viene, simplemente no se muestra.
  const badgeHTML = product.badge
    ? `<span class="card-badge">${product.badge}</span>`
    : '';

  return `
    <div class="food-card" data-category="${product.category}">
      <div class="card-img-wrap">
        <img src="${imagePath}" alt="${product.name}" onerror="this.src='https://placehold.co/400x240/141A21/F59E0B?text=Sin+imagen'">
        ${badgeHTML}
      </div>
      <div class="card-body">
        <h3 class="card-title">${product.name}</h3>
        <p class="card-desc">${product.description ?? ''}</p>
        <div class="card-footer">
          <span class="card-price">Gs. ${priceFormatted}</span>
          <a href="https://wa.me/595982389243?text=${waMessage}" target="_blank" class="btn-order-item">
            Pedir 💬
          </a>
        </div>
      </div>
    </div>
  `;
}