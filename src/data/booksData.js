// ==========================================
// DATOS DE LIBROS (Array con 10 libros)
// ==========================================

export const booksData = [
  {
    id: 1,                                    // ID único para identificar cada libro
    title: "Cien Años de Soledad",            // Título del libro
    author: "Gabriel García Márquez",         // Autor
    price: 19990,                             // Precio en pesos chilenos
    category: "novela",                       // Categoría (para filtros)
    format: "fisico",                         // Formato: "fisico" o "ebook"
    image: "https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg", // Imagen
    description: "Una de las obras más importantes de la literatura universal...",
    year: 1967,                               // Año de publicación
    pages: 496,                               // Número de páginas
    video: "/videos/100-anos-soledad.mp4"     // Video (opcional)
  },
  {
    id: 2,
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    price: 12990,
    category: "infantil",
    format: "ebook",
    image: "https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg",
    description: "Un clásico que narra las aventuras de un pequeño príncipe que viaja por el universo...",
    year: 1943,
    pages: 96,
    video: "/videos/el-principito.mp4"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 15990,
    category: "ciencia-ficcion",
    format: "fisico",
    image: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
    description: "Una distopía donde el Gran Hermano vigila todos los movimientos de los ciudadanos.",
    year: 1949,
    pages: 328,
    video: "/videos/1984.mp4"
  },
  {
    id: 4,
    title: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    price: 24990,
    category: "clasico",
    format: "fisico",
    image: "https://covers.openlibrary.org/b/isbn/9780060934347-M.jpg",
    description: "La obra más importante de la literatura española, con las aventuras del ingenioso hidalgo.",
    year: 1605,
    pages: 896,
    video: "/videos/quijote.mp4"
  },
  {
    id: 5,
    title: "El Alquimista",
    author: "Paulo Coelho",
    price: 14990,
    category: "ficcion",
    format: "ebook",
    image: "https://covers.openlibrary.org/b/isbn/9780062502179-M.jpg",
    description: "Un joven pastor viaja desde España hasta Egipto en busca de un tesoro y el sentido de la vida.",
    year: 1988,
    pages: 208,
    video: "/videos/alquimista.mp4"
  },
  {
    id: 6,
    title: "La Casa de los Espíritus",
    author: "Isabel Allende",
    price: 18990,
    category: "novela",
    format: "fisico",
    image: "https://covers.openlibrary.org/b/isbn/9780553383805-M.jpg",
    description: "Saga familiar que mezcla realismo mágico y crítica social a través de varias generaciones.",
    year: 1982,
    pages: 480,
    video: "/videos/casa-espiritus.mp4"
  },
  
];

// ==========================================
// CATEGORÍAS PARA FILTROS
// ==========================================

export const categories = [
  { id: 'all', label: 'Todos' },               // "all" muestra todos los libros
  { id: 'novela', label: 'Novela' },
  { id: 'infantil', label: 'Infantil' },
  { id: 'ciencia-ficcion', label: 'Ciencia Ficción' },
  { id: 'clasico', label: 'Clásico' },
  { id: 'ficcion', label: 'Ficción' }
];

// ==========================================
// FORMATOS PARA FILTROS
// ==========================================

export const formats = [
  { id: 'all', label: 'Todos' },               // "all" muestra todos los formatos
  { id: 'fisico', label: 'Físico' },
  { id: 'ebook', label: 'E-book' }
];