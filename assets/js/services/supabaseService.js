// assets/js/supabaseService.js

// 1. Inicializar el cliente usando 'supabaseClient' (en lugar de 'supabase')
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Obtiene los productos pertenecientes a un restaurante específico.
 * @param {string} restaurantId - UUID del restaurante
 * @returns {Promise<Array>} Lista de productos
 */
async function getProducts(restaurantId) {
  try {
    // Reemplaza 'products' o 'menu' por el nombre exacto de tu tabla en Supabase
    const { data, error } = await supabaseClient
      .from('products') 
      .select('*')
      .eq('restaurant_id', restaurantId);

    if (error) {
      console.error('❌ Error al obtener productos de Supabase:', error.message);
      return [];
    }

    console.log('✅ Conexión exitosa. Productos cargados:', data);
    return data;
  } catch (err) {
    console.error('❌ Error inesperado de conexión:', err);
    return [];
  }
}