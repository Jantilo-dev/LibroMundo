const BASE_URL = import.meta.env.VITE_API_URL

// Crea un nuevo pedido (POST /libreria)
export async function createPedido(data) {
  const res = await fetch(`${BASE_URL}libreria`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }
  return res.json()
}

// Obtiene todos los pedidos (GET /libreria)
export async function getPedidos() {
  const res = await fetch(`${BASE_URL}libreria`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

// Obtiene un pedido por ID (GET /libreria/:id)
export async function getPedido(id) {
  const res = await fetch(`${BASE_URL}libreria/${id}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

// Actualiza un pedido (PUT /libreria/:id)
export async function updatePedido(id, data) {
  const res = await fetch(`${BASE_URL}libreria/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

// Elimina un pedido (DELETE /libreria/:id)
export async function deletePedido(id) {
  const res = await fetch(`${BASE_URL}libreria/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
