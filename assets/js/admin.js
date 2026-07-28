// assets/js/admin.js
// Orquesta el panel administrativo. Depende de:
//   - supabaseService.js  (getProducts, toggleAvailability, etc.)
//   - productCard.js      (reusa buildImagePath para las miniaturas)

let productsData = [];

async function loadDashboard() {
  // El admin necesita ver TODO, disponible o no, por eso no pasamos onlyAvailable.
  productsData = await getProducts(RESTAURANT_ID);
  updateMetrics();
  renderProductsList();
}

function renderProductsList() {
  const list = document.getElementById('admin-list');

  if (productsData.length === 0) {
    list.innerHTML = `<p style="text-align:center; color:var(--text-muted)">No hay productos registrados.</p>`;
    return;
  }

  list.innerHTML = productsData.map(p => {
    const priceFormatted = Number(p.price).toLocaleString('es-PY');
    const imagePath = buildImagePath(p); // función reusada de productCard.js

    return `
      <div class="admin-item ${p.is_available ? '' : 'out-of-stock'}">
        <img src="${imagePath}" class="item-img" alt="${p.name}" onerror="this.src='https://placehold.co/60x60/141A21/F59E0B?text=Img'">
        <div class="item-info">
          <h4>${p.name}</h4>
          <div class="price-tag">Gs. ${priceFormatted}</div>
        </div>
        <div class="item-actions">
          <div class="item-buttons">
            <button class="icon-btn" onclick="editProduct('${p.id}')" title="Editar">✏️</button>
            <button class="icon-btn delete" onclick="confirmDelete('${p.id}')" title="Eliminar">🗑️</button>
          </div>
          <label class="switch">
            <input type="checkbox" ${p.is_available ? 'checked' : ''} onchange="toggleStock('${p.id}', this.checked)">
            <span class="slider"></span>
          </label>
          <span class="stock-label ${p.is_available ? 'on' : 'off'}">
            ${p.is_available ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

function updateMetrics() {
  const total = productsData.length;
  const active = productsData.filter(p => p.is_available).length;
  document.getElementById('stat-total').innerText = total;
  document.getElementById('stat-active').innerText = active;
  document.getElementById('stat-off').innerText = total - active;
}

/**
 * Se llama al mover el switch de una tarjeta. Actualiza la UI al toque
 * (optimista) y si el guardado en Supabase falla, revierte el cambio.
 */
async function toggleStock(productId, isAvailable) {
  const item = productsData.find(p => p.id === productId);
  if (item) item.is_available = isAvailable;

  updateMetrics();
  renderProductsList();

  const success = await toggleAvailability(productId, isAvailable);

  if (!success) {
    // Revertir si Supabase no pudo guardar el cambio
    if (item) item.is_available = !isAvailable;
    updateMetrics();
    renderProductsList();
    alert('No se pudo actualizar el producto. Intentá de nuevo.');
  }
}

/**
 * Abre el modal de producto en modo edición, precargado con sus datos.
 * La lógica de abrir el modal vive en admin.html (openProductModal),
 * acá solo buscamos el producto en memoria y se lo pasamos.
 */
function editProduct(productId) {
  const product = productsData.find(p => p.id === productId);
  if (product) openProductModal(product);
}

/**
 * Pide confirmación y elimina un producto definitivamente.
 */
async function confirmDelete(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const result = await Swal.fire({
    title: `¿Eliminar "${product.name}"?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    background: '#141A21',
    color: '#F3F4F6',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#232D39',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  const success = await deleteProduct(productId);

  if (!success) {
    Swal.fire({
      title: 'No se pudo eliminar',
      text: 'Intentá de nuevo en unos segundos.',
      icon: 'error',
      background: '#141A21',
      color: '#F3F4F6',
      confirmButtonColor: '#F59E0B',
    });
    return;
  }

  Swal.fire({
    title: 'Eliminado',
    text: `"${product.name}" se quitó de la carta.`,
    icon: 'success',
    background: '#141A21',
    color: '#F3F4F6',
    confirmButtonColor: '#F59E0B',
    timer: 1800,
    timerProgressBar: true,
  });

  await loadDashboard();
}

document.addEventListener('DOMContentLoaded', loadDashboard);