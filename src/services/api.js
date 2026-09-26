// ============================================================
// MODIFICADO: este archivo apuntaba a la API compartida del curso
// (https://apiclases.inacode.cl) usando las rutas `libreria`.
// Ahora apunta al backend propio Django REST (VITE_API_URL) con:
//   - pedidos: `/api/pedidos/`  (antes `/libreria`)
//   - libros:  `/api/libros/`   (antes no se consultaban: hardcodeados)
// Además se agrega el header de autenticacion por token en TODAS
// las peticiones (Requisito 3 y 4 de la evaluacion).
// ============================================================

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/').replace(/\/?$/, '/')
const TOKEN = import.meta.env.VITE_API_TOKEN || ''

// Helper: ejecuta el fetch con Content-Type y Authorization: Token
async function apiFetch(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { 'Authorization': `Token ${TOKEN}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    // MODIFICADO: el backend Django responde con {detail: "..."} (antes {message: "..."})
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || err.message || `Error ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// Obtiene el catalogo de libros (GET /api/libros/).
// NUEVO: antes los libros estaban hardcodeados en data/booksData.js.
export function getLibros() {
  return apiFetch('libros/')
}

// Crea un nuevo pedido (POST /api/pedidos/). Antes: POST /libreria
export function createPedido(data) {
  return apiFetch('pedidos/', { method: 'POST', body: JSON.stringify(data) })
}

// Obtiene todos los pedidos (GET /api/pedidos/). Antes: GET /libreria
export function getPedidos() {
  return apiFetch('pedidos/')
}

// Obtiene un pedido por ID (GET /api/pedidos/:id/). Antes: GET /libreria/:id
export function getPedido(id) {
  return apiFetch(`pedidos/${id}/`)
}

// Actualiza un pedido (PUT /api/pedidos/:id/). Antes: PUT /libreria/:id
export function updatePedido(id, data) {
  return apiFetch(`pedidos/${id}/`, { method: 'PUT', body: JSON.stringify(data) })
}

// Elimina un pedido (DELETE /api/pedidos/:id/). Antes: DELETE /libreria/:id
export function deletePedido(id) {
  return apiFetch(`pedidos/${id}/`, { method: 'DELETE' })
}