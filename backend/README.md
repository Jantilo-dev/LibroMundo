# LibroMundo - Backend (Django REST Framework)

API REST propia para el proyecto **LibroMundo** (librería online).
Reemplaza a la API compartida del curso y se conecta al proyecto React existente.

Arquitectura **hexagonal** (puertos y adaptadores) dentro de la app `libreria/`:

```
backend/
├── manage.py
├── requirements.txt
├── config/                        # proyecto Django (settings, urls)
└── libreria/                      # app Django
    ├── domain/                    ← CORE DOMAIN (centro del hexágono)
    │   ├── entities.py            #   Libro y Pedido (dataclasses puras, sin Django)
    │   └── repositories.py        #   PUERTO: interfaces ABC de cada repositorio
    ├── application/               ← APPLICATION RING
    │   ├── use_cases.py           #   casos de uso: Listar/Crear/Actualizar/Eliminar
    │   └── exceptions.py          #   errores de negocio (sin depender de HTTP)
    ├── infrastructure/            ← ADAPTADOR SECUNDARIO (driven / salida)
    │   ├── models.py              #   LibroModel, PedidoModel (ORM, detalle persistencia)
    │   ├── repositories.py        #   DjangoLibroRepository / DjangoPedidoRepository
    │   └── di.py                  #   fábrica que decide qué implementación usar
    └── api/                       ← ADAPTADOR PRIMARIO (driving / entrada)
        ├── serializers.py         #   JSON <-> entidad de dominio
        ├── views.py               #   recibe HTTP, llama al caso de uso, responde
        └── urls.py                #   rutas /api/libros/ y /api/pedidos/
```

**Regla de dependencia (clave):** las flechas siempre apuntan HACIA el dominio.
`api/` y `infrastructure/` conocen a `application/` y `domain/`; pero `domain/`
y `application/` NUNCA importan Django, DRF ni HTTP. Por eso se puede cambiar
de framework web o de motor de base de datos sin tocar la lógica de negocio.

---

## 📄 Documentación de endpoints

Consulta la documentación completa de la API (endpoints, ejemplos de request/response y códigos de estado) en:

👉 **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

---

## 1. Requisitos

- Python 3.13 (o 3.10+)
- pip

## 2. Instalacion y levantamiento

```bash
# (opcional) crear entorno virtual
python -m venv venv
venv\Scripts\activate            # Windows

# instalar dependencias
pip install -r requirements.txt

# migraciones + datos del catalogo (siembra 6 libros)
python manage.py migrate

# levantar el servidor
python manage.py runserver
```

La API queda en `http://127.0.0.1:8000/api/`.

> El catalogo inicial (6 libros) se carga automaticamente con la migracion
> `0002_seed_libros.py`.

## 3. Crear superusuario y token

```bash
python manage.py createsuperuser        # ej. usuario: admin
python manage.py drf_create_token admin # muestra el token
```

El token se envia en cada peticion en el header:

```
Authorization: Token <tu_token>
```

Tambien se puede obtener por HTTP:

```
POST /api/token/
Body: { "username": "admin", "password": "tu_password" }
Respuesta: { "token": "..." }
```

Sin token, la API responde `401 Unauthorized`.

## 4. Endpoints

Todas las rutas requieren `Authorization: Token <token>` excepto
`POST /api/token/`.

### Autenticacion

| Metodo | URL                    | Descripcion                        |
|--------|------------------------|------------------------------------|
| POST   | `/api/token/`          | Obtener token con usuario/contraseña |

### Libros (entidad principal / catalogo)

| Metodo | URL                    | Descripcion                          |
|--------|------------------------|--------------------------------------|
| GET    | `/api/libros/`         | Listar todos los libros              |
| GET    | `/api/libros/<id>/`    | Obtener un libro por id              |
| POST   | `/api/libros/`         | Crear un libro                       |
| PUT    | `/api/libros/<id>/`    | Actualizar un libro (todos los campos) |
| DELETE | `/api/libros/<id>/`    | Eliminar un libro                    |

`POST/PUT /api/libros/` body:

```json
{
  "title": "Cien Años de Soledad",
  "author": "Gabriel García Márquez",
  "price": 19990,
  "category": "novela",
  "format": "fisico",
  "image": "https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg",
  "description": "Obra maestra de la literatura universal.",
  "year": 1967,
  "pages": 496,
  "video": "a5evsIcpsLQ"
}
```

### Pedidos (entidad secundaria / transaccional)

| Metodo | URL                    | Descripcion                          |
|--------|------------------------|--------------------------------------|
| GET    | `/api/pedidos/`        | Listar pedidos (`{ "datos": [...] }`) |
| GET    | `/api/pedidos/<id>/`   | Obtener un pedido (`{ "datos": {...} }`) |
| POST   | `/api/pedidos/`        | Crear un pedido                       |
| PUT    | `/api/pedidos/<id>/`   | Actualizar pedido (acepta parcial: solo `estado`) |
| DELETE | `/api/pedidos/<id>/`   | Eliminar un pedido                    |

`POST /api/pedidos/` body (misma forma que usaba el frontend):

```json
{
  "libro": 1,
  "cliente": {
    "nombre": "Josefa Aranguiz",
    "email": "josefa@correo.com",
    "direccion": "Los Pinos 88"
  },
  "items": [
    { "libroId": 1, "titulo": "Cien Años de Soledad", "precio": 19990, "cantidad": 1 }
  ],
  "total": 19990,
  "metodoEntrega": "despacho a domicilio",
  "estado": "pendiente",
  "fecha": "2026-07-08"
}
```

> `libro` es opcional: si no se envia, se toma del primer `items[0].libroId`
> (asi el frontend actual funciona sin cambios). Los estados validos son:
> `pendiente`, `confirmado`, `enviado`, `completado`, `cancelado`.

Ejemplo de actualizacion de estado (lo que hace el panel Admin):

```
PUT /api/pedidos/1/
Body: { "estado": "confirmado" }
```

## 5. Modelo relacional

Django usa SQLite (relacional), no MongoDB. Por eso:

- **Libro** (`LibroModel`, catalogo): columnas directas.
- **Pedido** (`PedidoModel`): ForeignKey hacia `LibroModel` + columnas aplanadas
  (`cliente_nombre`, `cliente_email`, `cliente_direccion`) + `items` (JSONField)
  para varios libros por pedido sin crear una tercera tabla.

## 6. Reglas de negocio (en `application/use_cases.py`)

- **Libro duplicado**: no se permite crear un libro con un titulo que ya existe → `400`.
- **Total de pedido**: no puede ser negativo → `400`.
- **Transicion de estados**: solo se aceptan transiciones válidas
  (`pendiente → confirmado → enviado → completado`; `cancelado` desde
  cualquiera). Cualquier otra → `400`.

## 7. Conectar el frontend React

En `src/services/api.js` del proyecto React, apuntar a este backend
y agregar el header de autenticacion en cada `fetch`:

```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/'
const TOKEN = '<tu_token>'

async function apiFetch(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${TOKEN}`,
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }
  return res.json()
}
```