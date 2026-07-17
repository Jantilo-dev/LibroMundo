// ==========================================
// IMPORTACIONES
// ==========================================

import React, { useState, useEffect } from 'react';
// useState: Filtros y modal | useEffect: Filtrar libros

import { Container, Row, Col } from 'react-bootstrap';
// Container, Row, Col: Sistema de grid de Bootstrap

import { booksData } from '../data/booksData';
// Datos de libros

import BookCard from './BookCard';
import Filters from './Filters';
import BookModal from './BookModal';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const BookGrid = ({ cartCount, setCartCount, cartItems, setCartItems }) => {
  // Props del carrito desde App

  // Estados locales
  const [books, setBooks] = useState(booksData);
  // books: Array de libros filtrados para mostrar

  const [selectedCategory, setSelectedCategory] = useState('all');
  // selectedCategory: Categoría seleccionada en filtros

  const [selectedFormat, setSelectedFormat] = useState('all');
  // selectedFormat: Formato seleccionado en filtros

  const [selectedBook, setSelectedBook] = useState(null);
  // selectedBook: Libro seleccionado para el modal

  const [showModal, setShowModal] = useState(false);
  // showModal: Controla si el modal está visible

  // useEffect: Filtra libros cuando cambian categoría o formato
  useEffect(() => {
    let filtered = booksData; // Copia todos los libros
    
    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    
    // Filtro por formato
    if (selectedFormat !== 'all') {
      filtered = filtered.filter(book => book.format === selectedFormat);
    }
    
    setBooks(filtered); // Actualiza la lista mostrada
  }, [selectedCategory, selectedFormat]); // Dependencias

  // Manejador: Cambio de categoría
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Manejador: Cambio de formato
  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  // Manejador: Clic en libro - abre modal
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Manejador: Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  // Manejador: Agregar al carrito
  const handleAddToCart = (book) => {
    setCartItems(prevCart => [...prevCart, book]);
    setCartCount(prev => prev + 1);
    
    // Notificación temporal (3 segundos)
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed bottom-0 end-0 m-3';
    notification.style.zIndex = '9999';
    notification.textContent = `✅ "${book.title}" agregado al carrito`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <section id="libros" className="py-5">
      <Container>
        <h2 className="text-center mb-4">📚 Nuestros Libros</h2>
        <p className="text-center text-muted mb-4">
          {books.length} libros disponibles
        </p>
        
        {/* Componente de filtros */}
        <Filters
          selectedCategory={selectedCategory}
          selectedFormat={selectedFormat}
          onCategoryChange={handleCategoryChange}
          onFormatChange={handleFormatChange}
        />
        
        {/* Grid de libros (responsive) */}
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {books.map((book) => (
            <Col key={book.id}>
              <BookCard
                book={book}
                onBookClick={handleBookClick}
                onAddToCart={handleAddToCart}
              />
            </Col>
          ))}
        </Row>
        
        {/* Mensaje si no hay libros con los filtros */}
        {books.length === 0 && (
          <div className="text-center py-5">
            <h4>No hay libros en esta categoría</h4>
            <p className="text-muted">Prueba con otros filtros</p>
          </div>
        )}
        
        {/* Modal de detalles del libro */}
        <BookModal
          show={showModal}
          book={selectedBook}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      </Container>
    </section>
  );
};

export default BookGrid;