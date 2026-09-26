# SPECS.md — LibroMundo (Especificación del sistema)

Documento de especificación: define **qué** debe hacer el sistema. Complementa al
[AGENTS.md](AGENTS.md) (que define *cómo* se trabaja en el código).

---

## 1. Visión general

Tienda virtual de libros con carrito de compras, filtros por categoría/formato y
gestión de pedidos vía API REST. Compuesto por:

- **Frontend**: React 18 + Vite + Bootstrap 5 (sin reformatear).
- **Backend**: Django REST Framework con arquitectura hexagonal y base de datos
  relacional (SQLite).

Objetivo de la evaluación: reemplazar la API compartida del curso por un backend
propio conectado al mismo frontend.

---

## 2. Entidades

### 2.1 Entidad principal — Libro (catálogo)

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `id` | int | auto | PK |
| `title` | string | ✅ | único (regla de negocio) |
| `author` | string | ✅ | |
| `price` | int | ✅ | CLP |
| `category` | string | ✅ | novela, infantil, ciencia-ficcion, clasico, ficcion |
| `format` | string | ✅ | `fisico` / `ebook` |
| `image` | string (URL) | ✅ | portada |
| `description` | string | ✅ | |
| `year` | int | ✅ | |
| `pages` | int | ✅ | |
| `video` | string | no | id de YouTube |

### 2.2 Entidad secundaria — Pedido (transaccional)

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `id` | int | auto | PK |
| `libro` | FK → Libro | no | opcional; se deduce de `items[0].libroId` si falta |
| `cliente_nombre` | string | ✅ | columna aplanada (relacional) |
| `cliente_email` | string (email) | ✅ | |
| `cliente_direccion` | string | ✅ | |
| `items` | JSONField | ✅ | varios libros por pedido (sin 3ª entidad) |
| `total` | int | ✅ | no puede ser negativo |
| `metodo_entrega` | string | ✅ | `despacho a domicilio` / `retiro en tienda` |
| `estado` | string | no | default `pendiente` |
| `fecha` | string (YYYY-MM-DD) | ✅* | la tabla NO admite NULL |

\* `fecha` es opcional en el serializer pero obligatoria en la base (si se omite → error).

---

## 3. Modelo relacional

- SQLite (relacional). No MongoDB.
- `PedidoModel` tiene **ForeignKey** hacia `LibroModel`.
- El subdocumento `cliente` de la API anterior se aplana en columnas
  (`cliente_nombre`, `cliente_email`, `cliente_direccion`).
- El array `items` se guarda en un **JSONField** dentro de la misma tabla.

---

## 4. Autenticación

- Método: **token por usuario** (DRF `TokenAuthentication`).
- Toda la API exige `Authorization: Token <token>` → sin token = `401`.
- Obtención del token: `POST /api/token/` con `{"username", "password"}`.
- Creación: `manage.py createsuperuser` + `manage.py drf_create_token <usuario>`.

---

## 5. Endpoints

Base URL: `http://127.0.0.1:8000/api/`

| Método | URL | Descripción | Body / Respuesta |
|---|---|---|---|
| POST | `/api/token/` | Obtener token | body: `{username, password}` → `{token}` |
| GET | `/api/libros/` | Listar libros | → array de libros |
| POST | `/api/libros/` | Crear libro | body: campos de Libro → `201` libro |
| GET | `/api/libros/<id>/` | Detalle libro | → libro |
| PUT | `/api/libros/<id>/` | Actualizar libro | body: campos → `200` libro |
| DELETE | `/api/libros/<id>/` | Eliminar libro | → `204` |
| GET | `/api/pedidos/` | Listar pedidos | → `{datos: [pedido]}` |
| POST | `/api/pedidos/` | Crear pedido | body: `{cliente, items, total, metodoEntrega, ...}` → `201` |
| GET | `/api/pedidos/<id>/` | Detalle pedido | → `{datos: pedido}` |
| PUT | `/api/pedidos/<id>/` | Actualizar pedido | acepta parcial (ej. solo `estado`) → `200` |
| DELETE | `/api/pedidos/<id>/` | Eliminar pedido | → `204` |

### Forma de un pedido (POST / GET)

```json
{
  "id": 1,
  "libro": 1,
  "cliente": { "nombre": "...", "email": "...", "direccion": "..." },
  "items": [ { "libroId": 1, "titulo": "...", "precio": 19990, "cantidad": 1 } ],
  "total": 19990,
  "metodoEntrega": "despacho a domicilio",
  "estado": "pendiente",
  "fecha": "2026-07-08"
}
```

---

## 6. Reglas de negocio

1. **Título de libro duplicado** → `400`.
2. **Total de pedido negativo** → `400`.
3. **Transición de estados** válida:

| Desde | Puede pasar a |
|---|---|
| `pendiente` | `confirmado`, `cancelado` |
| `confirmado` | `enviado`, `cancelado` |
| `enviado` | `completado`, `cancelado` |
| `completado` | — |
| `cancelado` | — |

Cualquier otra transición → `400`.

---

## 7. Criterios de aceptación (Requisitos de la evaluación)

### Requisito 1 — Arquitectura hexagonal ✅
- [ ] 4 capas dentro de la app: `domain/`, `application/`, `infrastructure/`, `api/`.
- [ ] `domain/` = entidades puras (sin Django) + contrato del repositorio.
- [ ] `application/` = casos de uso (lógica de negocio).
- [ ] `infrastructure/` = modelos ORM + implementación del repositorio + DI.
- [ ] `api/` = serializers, vistas, rutas.
- [ ] `views.py` sin lógica de negocio; modelos sin reglas de negocio.

### Requisito 2 — Dos entidades relacionadas ✅
- [ ] `Libro` (catálogo) y `Pedido` (transaccional).
- [ ] ForeignKey de `Pedido` → `Libro`.
- [ ] Subdocumentos aplanados (`cliente_*`) e `items` en JSONField.

### Requisito 3 — Endpoints y autenticación ✅
- [ ] CRUD completo (GET/POST/PUT/DELETE) para ambas entidades.
- [ ] Toda la API protegida por token (`Authorization: Token ...`).
- [ ] Endpoints documentados (este documento + `API_DOCUMENTATION.md`).

### Requisito 4 — Conectar el frontend React ✅
- [ ] `api.js` apunta al backend propio (`http://127.0.0.1:8000/api/`).
- [ ] Token enviado en cada petición.
- [ ] Estructura del frontend sin reformatear.
- [ ] Flujo funcional: catálogo → carrito → checkout → pedido → admin.

---

## 8. Flujo de compra

```
Navegar libros → Agregar al carrito (localStorage)
  ↓
Ir al carrito (/carrito) → revisar items
  ↓
Checkout: datos del cliente + método de entrega/pago
  ↓
POST /api/pedidos/  (con Authorization: Token)
  ↓
Éxito: carrito vacío → vuelve al inicio | Error: mensaje en pantalla
  ↓
Admin (/admin): lista pedidos, cambia estado con PUT /api/pedidos/<id>/
```

---

## 9. Documentación relacionada

- `AGENTS.md` — guía de trabajo para agentes (comandos, reglas, estructura).
- `backend/README.md` — instalación, superusuario/token y endpoints.
- `backend/API_DOCUMENTATION.md` — documentación completa de endpoints con ejemplos.