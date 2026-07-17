// ==========================================
// IMPORTACIONES
// ==========================================

import React from 'react';
import { Card, Badge } from 'react-bootstrap';
// Card: Tarjeta | Badge: Etiqueta de formato

import { FaStar, FaShoppingCart } from 'react-icons/fa';
// FaStar: Calificación | FaShoppingCart: Carrito

// ==========================================
// COMPONENTE: Tarjeta de Libro
// ==========================================

const BookCard = ({ book, onBookClick, onAddToCart }) => {
  // Props:
  // book: Datos del libro
  // onBookClick: Abre modal al hacer clic
  // onAddToCart: Agrega al carrito

  return (
    // Card: Al hacer clic abre el modal
    <Card className="book-card shadow-sm h-100" onClick={() => onBookClick(book)}>
      
      {/* Contenedor de imagen con badge */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={book.image} 
          alt={book.title}
          style={{ height: '250px', objectFit: 'cover' }}
        />
        
        {/* Badge: Muestra formato (E-book o Físico) */}
        <Badge 
          bg={book.format === 'ebook' ? 'info' : 'secondary'}
          style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px 10px' }}
        >
          {book.format === 'ebook' ? '📱 E-book' : '📖 Físico'}
        </Badge>
      </div>

      {/* Contenido de la tarjeta */}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{book.title}</Card.Title>
        <Card.Text className="text-muted small">{book.author}</Card.Text>
        
        {/* Precio y calificación */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price">${book.price.toLocaleString()}</span>
          {/* Calificación aleatoria (3-5 estrellas) */}
          <span className="text-warning">
            <FaStar /> {Math.round(Math.random() * 2 + 3)}.5
          </span>
        </div>
        
        {/* Botón: Agregar al carrito */}
        <button
          className="btn btn-primary btn-sm mt-2 w-100"
          onClick={(e) => {
            e.stopPropagation(); // Evita abrir el modal
            onAddToCart(book);
          }}
        >
          <FaShoppingCart className="me-1" /> Agregar al carrito
        </button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;