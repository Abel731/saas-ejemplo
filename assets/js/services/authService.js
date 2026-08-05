// assets/js/services/authService.js
// Toda la lógica de sesión/autenticación vive acá.
// Depende de `supabaseClient`, que ya se crea en supabaseService.js
// (por eso este script tiene que cargar DESPUÉS de supabaseService.js).

/**
 * Intenta iniciar sesión con email y contraseña.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('❌ Error de login:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, session: data.session };
}

/**
 * Cierra la sesión activa.
 */
async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) console.error('❌ Error al cerrar sesión:', error.message);
}

/**
 * Devuelve la sesión activa, o null si no hay nadie logueado.
 */
async function getSession() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

/**
 * Guard de página: si no hay sesión activa, redirige a login.html.
 * Se llama al principio de cualquier página que requiera estar logueado.
 */
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = 'login.html';
  }
  return session;
}