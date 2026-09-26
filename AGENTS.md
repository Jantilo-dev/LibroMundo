# AGENTS.md — LibroMundo

Guía para agentes de IA que trabajen en este repositorio.
El proyecto tiene **dos partes separadas**: el frontend (React) y el backend (Django).
Regla transversal: **el frontend NO se reformatea** — solo se cambia el origen de los
datos y el token de autenticación.

---

# 1. Frontend (React + Vite)

Ubicado en la raíz (`src/`).

## Comandos

| Acción | Comando |
|---|---|
| Instalar dependencias | `pnpm install` (o `npm install`) |
| Servidor de desarrollo | `pnpm dev` |
| Build de producción | `pnpm build` |
| Previsualizar build | `pnpm preview` |

> El script `npm run lint` está **roto** (usa `--ext` con `eslint.config.js`, flat config).
> Para lintear usa `npx eslint .`.

## Estructura

```
src/
├── components/     Navbar, Hero, BookCarousel, BookGrid, BookCard, BookModal,
│                   Filters, CartPage, FAQAccordion, Newsletter, Footer, AdminPanel
├── data/           booksData.js (catálogo hardcodeado, fallback si la API no responde)
├── services/       api.js (todas las llamadas al backend)
├── styles/         custom.css
├── App.jsx         rutas y estado del carrito (localStorage)
└── main.jsx        entry point (BrowserRouter)
```

## Variables de entorno (`.env`)

```
VITE_API_URL=http://127.0.0.1:8000/api/
VITE_API_TOKEN=<token del backend>
```

## Conexión con el backend

- `src/services/api.js` apunta a `VITE_API_URL` y envía `Authorization: Token <VITE_API_TOKEN>` en **todas** las peticiones.
- Endpoints usados: `libros/`, `pedidos/` (con barra final).
- `CartPage` y `AdminPanel` ya consumen la forma de datos que devuelve el backend (`{datos: [...]}`, `cliente` anidado). **No modificarlos**.
- El catálogo (`BookGrid`) usa `booksData` como fallback si `getLibros()` falla.

## Reglas

- NO reformatear la estructura del frontend (exigencia de evaluación).
- Solo cambiar origen de datos en `api.js` / `.env` y el token.
- Los body de POST que envía el frontend NO se cambian: el backend los acepta tal cual.

---

# 2. Backend (Django REST Framework)

Ubicado en `backend/`. Arquitectura **hexagonal** (puertos y adaptadores) dentro de la app `libreria/`.

## Comandos

Usar siempre el Python del venv:

| Acción | Comando (desde `backend/`) |
|---|---|
| Activar entorno | `venv\Scripts\activate` |
| Instalar dependencias | `pip install -r requirements.txt` |
| Migrar (incluye sembrado de 6 libros) | `venv\Scripts\python.exe manage.py migrate` |
| Crear migración | `venv\Scripts\python.exe manage.py makemigrations` |
| Levantar servidor | `venv\Scripts\python.exe manage.py runserver` |
| Crear superusuario | `venv\Scripts\python.exe manage.py createsuperuser` |
| Crear token | `venv\Scripts\python.exe manage.py drf_create_token <usuario>` |
| System check | `venv\Scripts\python.exe manage.py check` |
| Shell | `venv\Scripts\python.exe manage.py shell` |

Dependencias: `Django`, `djangorestframework`, `django-cors-headers` (ver `requirements.txt`).

## Arquitectura hexagonal

```
backend/libreria/
├── domain/            ← CORE DOMAIN: entidades puras (dataclasses) + contrato de repositorios
│   ├── entities.py        Libro, Pedido (sin Django)
│   └── repositories.py    interfaces ABC (libro/pedido)
├── application/       ← APPLICATION RING: casos de uso + excepciones de negocio
│   ├── use_cases.py       Listar/Crear/Actualizar/Eliminar (con .ejecutar())
│   └── exceptions.py      errores de negocio (sin HTTP)
├── infrastructure/    ← ADAPTADOR SECUNDARIO: persistencia
│   ├── models.py          LibroModel, PedidoModel (ORM, detalle de persistencia)
│   ├── repositories.py    DjangoLibroRepository / DjangoPedidoRepository
│   └── di.py              fábricas get_libro_repository() / get_pedido_repository()
└── api/               ← ADAPTADOR PRIMARIO: HTTP
    ├── serializers.py     JSON <-> entidad (sin ModelSerializer)
    ├── views.py           APIView que llama al caso de uso y traduce excepciones a HTTP
    └── urls.py            rutas
```

**Regla de dependencia:** `domain/` y `application/` NUNCA importan Django/DRF/HTTP.
`api/` e `infrastructure/` sí. La lógica de negocio vive en `application/use_cases.py`;
**no** en `views.py` ni en los modelos.

## Modelo relacional (SQLite, no MongoDB)

- `PedidoModel` tiene ForeignKey a `LibroModel` + `items` (JSONField) + cliente aplanado
  en columnas (`cliente_nombre`, `cliente_email`, `cliente_direccion`).
- La tabla `fecha` NO admite NULL: enviarla siempre en los POST.

## Autenticación

- Token por usuario. Header obligatorio en TODA la API: `Authorization: Token <token>`.
- Obtener token: `POST /api/token/` con `{"username": "...", "password": "..."}`.
- Sin token → `401`.

## Endpoints

Base: `http://127.0.0.1:8000/api/`

| Método | URL | Descripción |
|---|---|---|
| POST | `/api/token/` | Obtener token (username/password) |
| GET | `/api/libros/` | Listar libros |
| POST | `/api/libros/` | Crear libro |
| GET | `/api/libros/<id>/` | Detalle de libro |
| PUT | `/api/libros/<id>/` | Actualizar libro |
| DELETE | `/api/libros/<id>/` | Eliminar libro |
| GET | `/api/pedidos/` | Listar pedidos (`{datos:[...]}`) |
| POST | `/api/pedidos/` | Crear pedido |
| GET | `/api/pedidos/<id>/` | Detalle de pedido |
| PUT | `/api/pedidos/<id>/` | Actualizar pedido (acepta parcial, ej. solo `estado`) |
| DELETE | `/api/pedidos/<id>/` | Eliminar pedido |

## Reglas de negocio (en `application/use_cases.py`)

- Libro con título duplicado → `400`.
- `total` de pedido negativo → `400`.
- Transiciones de estado: `pendiente → confirmado → enviado → completado`; `cancelado` desde cualquiera. Otra transición → `400`.

## Datos

- Superusuario existente: `admin` / `admin123`.
- La migración `0002_seed_libros` carga los 6 libros del catálogo.
- Documentación completa de endpoints: `backend/API_DOCUMENTATION.md`.

## Reglas

- Mantener la separación por capas; no meter lógica en `views.py` ni en los modelos.
- Los serializers de Pedido deben conservar la forma anidada que consume el frontend
  (`cliente: {nombre, email, direccion}`, `metodoEntrega`) y la envoltura `{datos: [...]}`.
- El `libro` (FK) es opcional en POST: si no viene, se deduce de `items[0].libroId`.