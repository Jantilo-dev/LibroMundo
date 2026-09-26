# Documentación de Endpoints — LibroMundo API

**Base URL:** `http://127.0.0.1:8000/api/`

**Autenticación:** todas las rutas requieren el header `Authorization: Token <token>` (excepto `POST /api/auth/token/`). Sin token → `401 Unauthorized`.

**Formatos:** JSON. Enviar `Content-Type: application/json`.

---

## Índice

1. [Autenticación](#1-autenticación)
2. [Libros (entidad principal)](#2-libros-entidad-principal--catálogo)
3. [Pedidos (entidad secundaria)](#3-pedidos-entidad-secundaria--transaccional)
4. [Códigos de estado](#4-resumen-de-códigos-de-estado)

---

## 1. Autenticación

### `POST /api/auth/token/` — Obtener token

| Campo | Tipo | Requerido |
|---|---|---|
| `username` | string | ✅ |
| `password` | string | ✅ |

**Request**
```json
{ "username": "admin", "password": "admin123" }
```

**Respuesta `200 OK`**
```json
{ "token": "35aaa56527362d5c325664eb9c75c7b6036c1409" }
```

**Errores:** `400` (credenciales inválidas).

---

## 2. Libros (entidad principal — catálogo)

### `GET /api/libros/` — Listar libros

**Respuesta `200 OK`**
```json
[
  {
    "id": 1,
    "title": "Cien Años de Soledad",
    "author": "Gabriel García Márquez",
    "price": 19990,
    "category": "novela",
    "format": "fisico",
    "image": "https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg",
    "description": "Una de las obras más importantes de la literatura universal...",
    "year": 1967,
    "pages": 496,
    "video": "a5evsIcpsLQ"
  }
]
```

### `POST /api/libros/` — Crear libro

| Campo | Tipo | Requerido |
|---|---|---|
| `title` | string | ✅ |
| `author` | string | ✅ |
| `price` | int | ✅ |
| `category` | string | ✅ |
| `format` | string | ✅ |
| `image` | string (URL) | ✅ |
| `description` | string | ✅ |
| `year` | int | ✅ |
| `pages` | int | ✅ |
| `video` | string | no |

**Request**
```json
{
  "title": "Libro Nuevo",
  "author": "Autor",
  "price": 15990,
  "category": "novela",
  "format": "fisico",
  "image": "https://ejemplo.com/portada.jpg",
  "description": "Descripción del libro.",
  "year": 2026,
  "pages": 300,
  "video": ""
}
```

**Respuesta `201 Created`** — el libro creado (mismo formato del GET).  
**Error:** `400` si falta algún campo obligatorio o el tipo es inválido.

### `GET /api/libros/<id>/` — Obtener un libro

**Respuesta `200 OK`** — el libro.  
**Error:** `404` si el id no existe.

### `PUT /api/libros/<id>/` — Actualizar libro

Requiere **todos** los campos (igual que el POST).  
**Respuesta `200 OK`** — el libro actualizado.  
**Errores:** `400` (validación), `404` (no existe).

### `DELETE /api/libros/<id>/` — Eliminar libro

**Respuesta `204 No Content`** (sin cuerpo).  
**Error:** `404` si no existe.

---

## 3. Pedidos (entidad secundaria — transaccional)

> La respuesta de pedidos usa la forma anidada que consume el frontend:
> `cliente: {nombre, email, direccion}` y `metodoEntrega`.

### `GET /api/pedidos/` — Listar pedidos

**Respuesta `200 OK`**
```json
{
  "datos": [
    {
      "id": 1,
      "libro": 1,
      "cliente": { "nombre": "Josefa Aranguiz", "email": "josefa@correo.com", "direccion": "Los Pinos 88" },
      "items": [
        { "libroId": 1, "titulo": "Cien Años de Soledad", "precio": 19990, "cantidad": 1 }
      ],
      "total": 19990,
      "metodoEntrega": "despacho a domicilio",
      "estado": "pendiente",
      "fecha": "2026-07-08"
    }
  ]
}
```

### `POST /api/pedidos/` — Crear pedido

| Campo | Tipo | Requerido | Nota |
|---|---|---|---|
| `libro` | int | no | id del Libro; si se omite se toma de `items[0].libroId` |
| `cliente.nombre` | string | ✅ | |
| `cliente.email` | string | ✅ | formato email |
| `cliente.direccion` | string | ✅ | |
| `items` | array | ✅ | libros del pedido |
| `items[].libroId` | int | no | |
| `items[].titulo` | string | ✅ | |
| `items[].precio` | int | ✅ | |
| `items[].cantidad` | int | ✅ | |
| `total` | int | ✅ | |
| `metodoEntrega` | string | ✅ | `despacho a domicilio` / `retiro en tienda` |
| `estado` | string | no | por defecto `pendiente` |
| `fecha` | string (YYYY-MM-DD) | no | |

**Request**
```json
{
  "cliente": { "nombre": "Josefa Aranguiz", "email": "josefa@correo.com", "direccion": "Los Pinos 88" },
  "items": [
    { "libroId": 1, "titulo": "Cien Años de Soledad", "precio": 19990, "cantidad": 1 }
  ],
  "total": 19990,
  "metodoEntrega": "despacho a domicilio",
  "estado": "pendiente",
  "fecha": "2026-07-08"
}
```

**Respuesta `201 Created`** — el pedido creado (misma forma del GET).  
**Error:** `400` si falta algún campo obligatorio o el email es inválido.

### `GET /api/pedidos/<id>/` — Obtener un pedido

**Respuesta `200 OK`**
```json
{ "datos": { "...": "igual a un item del listado" } }
```
**Error:** `404` si no existe.

### `PUT /api/pedidos/<id>/` — Actualizar pedido

Acepta **datos parciales** (solo los campos que se quieran cambiar). Útil para cambiar el estado.

**Request (solo estado)**
```json
{ "estado": "confirmado" }
```

Estados válidos: `pendiente`, `confirmado`, `enviado`, `completado`, `cancelado`.

**Respuesta `200 OK`** — el pedido actualizado con la forma completa.  
**Errores:** `400` (estado inválido), `404` (no existe).

### `DELETE /api/pedidos/<id>/` — Eliminar pedido

**Respuesta `204 No Content`.**  
**Error:** `404` si no existe.

---

## 4. Resumen de códigos de estado

| Código | Significado |
|---|---|
| `200` | OK (GET / PUT) |
| `201` | Creado (POST) |
| `204` | Eliminado (DELETE) |
| `400` | Validación fallida o credenciales inválidas |
| `401` | Token faltante o inválido |
| `404` | Recurso no encontrado |