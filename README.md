# LibroMundo - Libreria Online

Tienda virtual de libros con carrito de compras, filtros y pedidos via API REST.
React 18 + Vite 5 + Bootstrap 5 + react-router-dom.

---

## Contenido

- [Tecnologias](#tecnologias)
- [Instalacion](#instalacion)
- [Estructura](#estructura)
- [Componentes](#componentes)
- [Backend (Django API)](#backend-django-api)
- [API / Endpoints](#api--endpoints)
- [Flujo de compra](#flujo-de-compra)

---

## Backend (Django API)

Este proyecto se conecta a un backend propio construido con **Django REST Framework**
(arquitectura hexagonal) ubicado en la carpeta `backend/`:

- [README del Backend](backend/README.md) — instalación, superusuario/token y endpoints
- [Documentación de Endpoints](backend/API_DOCUMENTATION.md) — endpoints, ejemplos request/response y códigos de estado

Para conectar este frontend al backend, configura en `.env` la URL del API y el token
(ver [README del Backend](backend/README.md)).

---

## Tecnologias

| Tecnologia | Version |
|---|---|
| React | 18 |
| Vite | 5 |
| Bootstrap | 5.3 |
| react-bootstrap | 2.10 |
| react-router-dom | 6 |
| react-icons | 5 |
| ESLint | 8 |

---

## Instalacion

```bash
cd libromundo
pnpm install
pnpm dev
```

| Comando | Accion |
|---|---|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Compila para produccion |
| `pnpm preview` | Previsualiza el build |

---

## Estructura

```
libromundo/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          Barra de navegacion + carrito dropdown
│   │   ├── Hero.jsx            Banner principal
│   │   ├── BookCarousel.jsx    Carrusel de libros destacados
│   │   ├── BookGrid.jsx        Grid de libros con filtros
│   │   ├── BookCard.jsx        Tarjeta individual de libro
│   │   ├── BookModal.jsx       Modal con detalle del libro
│   │   ├── Filters.jsx         Filtros por categoria y formato
│   │   ├── CartPage.jsx        Pagina de carrito + checkout + API
│   │   ├── FAQAccordion.jsx    Acordeon de preguntas frecuentes
│   │   ├── Newsletter.jsx      Suscripcion a novedades
│   │   └── Footer.jsx          Pie de pagina
│   ├── data/
│   │   └── booksData.js        Catalogo de 10 libros
│   ├── services/
│   │   └── api.js              Funciones CRUD para API REST
│   ├── styles/
│   │   └── custom.css          Estilos personalizados
│   ├── App.jsx                 Orquestador + rutas
│   ├── index.css               Estilos globales
│   └── main.jsx                Entry point
├── index.html
└── package.json
```

---

## Componentes

### Navbar
- Logo y nombre "LibroMundo"
- Enlaces: Inicio, Libros, FAQ, Contacto
- Dropdown del carrito con items agregados
- Boton "Carrito" con contador de items

### Hero
- Banner principal con titulo y subtitulo
- Llamado a la accion "Ver libros" (scroll suave)

### BookCarousel
- Carrusel Bootstrap con 3 libros destacados
- Portada, titulo y boton "Ver mas"

### BookGrid
- Grid responsivo de tarjetas de libros
- Filtros por categoria (novela, infantil, fantasia, etc.)
- Filtros por formato (fisico, ebook)
- Modal con detalle al hacer clic en un libro

### BookCard
- Tarjeta con portada, titulo, autor, precio
- Boton "Agregar al carrito"

### BookModal
- Modal con detalle completo del libro
- Portada grande, descripcion, año, paginas
- Boton para agregar al carrito

### CartPage
- Lista de libros en el carrito con opcion de eliminar
- Formulario de checkout: nombre, email, direccion, metodo de pago, metodo de entrega
- Al finalizar: envia POST /libreria al API REST
- Muestra alertas de exito o error

### Filters
- Select de categoria
- Select de formato
- Filtrado en tiempo real con useEffect

### FAQAccordion
- Acordeon Bootstrap con 4 preguntas frecuentes
- Temas: envio, devoluciones, pagos, soporte

### Newsletter
- Formulario de suscripcion con email
- Alerta de confirmacion al enviar

---

## API / Endpoints

Base URL: `https://apiclases.inacode.cl/`

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /libreria | Crear un pedido |
| GET | /libreria | Obtener todos los pedidos |
| GET | /libreria/:id | Obtener un pedido por ID |
| PUT | /libreria/:id | Actualizar un pedido |
| DELETE | /libreria/:id | Eliminar un pedido |

### Body de creacion (POST /libreria)

```json
{
  "cliente": {
    "nombre": "Josefa Aranguiz",
    "email": "josefa@correo.com",
    "direccion": "Los Pinos 88"
  },
  "items": [
    {
      "libroId": "1",
      "titulo": "Cien Anos de Soledad",
      "precio": 19990,
      "cantidad": 1
    }
  ],
  "total": 19990,
  "metodoEntrega": "despacho a domicilio",
  "estado": "pendiente",
  "fecha": "2026-07-08"
}
```

---

## Flujo de compra

```
Navegar libros → Agregar al carrito
  ↓
Ir al carrito (/carrito)
  ↓
Revisar items → Proceder al pago
  ↓
Llenar datos del cliente (nombre, email, direccion)
  ↓
Seleccionar metodo de entrega y metodo de pago
  ↓
Finalizar compra
  ↓
POST /libreria → API REST
  ↓
Exito: carrito vacio → redirige a inicio
Error: mensaje en pantalla
```
