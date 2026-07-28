// assets/js/services/supabaseService.js
// Toda la comunicación con Supabase vive acá. Ni la landing ni el admin
// hablan directamente con supabaseClient, siempre pasan por estas funciones.

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Trae los productos de un restaurante.
 * @param {string} restaurantId
 * @param {Object} [options]
 * @param {boolean} [options.onlyAvailable] - si es true, filtra is_available = true
 *   (para la landing pública). El panel admin lo llama SIN este flag para ver todo.
 */
async function getProducts(restaurantId, { onlyAvailable = false } = {}) {
  try {
    let query = supabaseClient
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: true });

    if (onlyAvailable) {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error al obtener productos:', error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error('❌ Error inesperado de conexión:', err);
    return [];
  }
}

/**
 * Cambia el estado de disponibilidad de un producto (switch del panel admin).
 */
async function toggleAvailability(productId, isAvailable) {
  const { error } = await supabaseClient
    .from('products')
    .update({ is_available: isAvailable })
    .eq('id', productId);

  if (error) {
    console.error('❌ Error al actualizar disponibilidad:', error.message);
    return false;
  }
  return true;
}

/**
 * Crea un producto nuevo. `product` debe incluir restaurant_id.
 * @returns {Promise<Object|null>} el producto creado, o null si falló
 */
async function addProduct(product) {
  const { data, error } = await supabaseClient
    .from('products')
    .insert([product])
    .select();

  if (error) {
    console.error('❌ Error al agregar producto:', error.message);
    return null;
  }
  return data[0];
}

/**
 * Edita un producto existente.
 * @returns {Promise<Object|null>} el producto actualizado, o null si falló
 */
async function updateProduct(productId, updates) {
  const { data, error } = await supabaseClient
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select();

  if (error) {
    console.error('❌ Error al editar producto:', error.message);
    return null;
  }
  return data[0];
}

/**
 * Elimina un producto definitivamente.
 * @returns {Promise<boolean>}
 */
async function deleteProduct(productId) {
  const { error } = await supabaseClient
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('❌ Error al eliminar producto:', error.message);
    return false;
  }
  return true;
}