# Documentación de Endpoints — LibroMundo API

**Base URL:** `http://127.0.0.1:8000/api/`

**Autenticación:** todas las rutas requieren el header `Authorization: Token <token>` (excepto `POST /api/token/`). Sin token → `401 Unauthorized`.

**Formatos:** JSON. Enviar `Content-Type: application/json`.

---

## Índice

1. [Autenticación](#1-autenticación)
2. [Libros (entidad principal)](#2-libros-entidad-principal--catálogo)
3. [Pedidos (entidad secundaria)](#3-pedidos-entidad-secundaria--transaccional)
4. [Códigos de estado](#4-resumen-de-códigos-de-estado)

---

## 1. Autenticación

Toda la API está protegida. Para consumir cualquier endpoint (excepto
`POST /api/auth/token/`) necesitas un **token de autenticación**.

---

### 1.1 ¿Qué es el token y cómo se usa?

Es una cadena de texto que identifica a un usuario. Se envía en el header
`Authorization` de cada petición:

```
Authorization: Token <tu_token>
```

Si lo omites o es inválido, la API responde `401 Unauthorized`:

```json
{ "detail": "Las credenciales de autenticación no se proveyeron." }
```

---

### 1.2 Paso 1 — Crear un superusuario

El token pertenece a un usuario. Primero crea uno (se te pedirá usuario, email
y contraseña):

```bash
python manage.py createsuperuser
```

> En este proyecto ya existe el usuario `admin` con contraseña `admin123`.

---

### 1.3 Paso 2 — Obtener tu token (dos formas)

#### Forma A — Por línea de comandos (rápida)

```bash
python manage.py drf_create_token <tu_usuario>
```

Ejemplo:

```bash
python manage.py drf_create_token admin
# Salida: Generated token 35aaa56527362d5c325664eb9c75c7b6036c1409 for user admin
```

#### Forma B — Por HTTP (el endpoint)

Si ya tienes usuario y contraseña, pídele el token a la API.

**Endpoint:** `POST /api/token/`

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `username` | string | ✅ | El nombre de usuario |
| `password` | string | ✅ | La contraseña del usuario |

**Request**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta `200 OK`**
```json
{
  "token": "35aaa56527362d5c325664eb9c75c7b6036c1409"
}
```

**Posibles errores**

| Código | Respuesta | Motivo |
|---|---|---|
| `400` | `{ "detail": "Las credenciales de autenticación no se proveyeron." }` | Falta `username` o `password` |
| `400` | `{ "non_field_errors": [ "No pudimos autenticar con esas credenciales." ] }` | Usuario o contraseña incorrectos |

> **Nota:** si regeneras el token con `drf_create_token`, el anterior deja de
> funcionar (el token se reemplaza).

---

### 1.4 Ejemplo de uso en Thunder Client

1. Crea la petición `POST http://127.0.0.1:8000/api/token/`
2. En la pestaña **Body** (JSON) pega:
   ```json
   { "username": "admin", "password": "admin123" }
   ```
3. Envía y copia el valor de `token` de la respuesta.
4. Para cualquier otro endpoint, en la pestaña **Headers** agrega:
   ```
   Authorization: Token 35aaa56527362d5c325664eb9c75c7b6036c1409
   ```

### 1.5 Ejemplo de uso con cURL

```bash
# 1) Obtener token
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2) Listar libros enviando el token
curl http://127.0.0.1:8000/api/libros/ \
  -H "Authorization: Token 35aaa56527362d5c325664eb9c75c7b6036c1409"
```

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
**Error:** `400` si falta algún campo obligatorio, el tipo es inválido o **ya existe un libro con ese título** (regla de negocio).

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
**Errores:** `400` si falta algún campo obligatorio, el email es inválido o el `total` es negativo.

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

**Transiciones de estado válidas** (regla de negocio en `application/use_cases.py`):

| Desde | Puede pasar a |
|---|---|
| `pendiente` | `confirmado`, `cancelado` |
| `confirmado` | `enviado`, `cancelado` |
| `enviado` | `completado`, `cancelado` |
| `completado` | — |
| `cancelado` | — |

**Respuesta `200 OK`** — el pedido actualizado con la forma completa.  
**Errores:** `400` (estado inválido o transición no permitida), `404` (no existe).

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