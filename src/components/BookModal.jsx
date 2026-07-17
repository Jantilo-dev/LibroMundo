// ==========================================
// IMPORTACIONES
// ==========================================

import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaBook, FaFileAlt, FaShoppingCart, FaTimes, FaVideo } from 'react-icons/fa';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const BookModal = ({ show, book, onClose, onAddToCart }) => {
  // Props:
  // show: Controla si el modal está visible
  // book: Datos del libro a mostrar
  // onClose: Función para cerrar el modal
  // onAddToCart: Función para agregar al carrito

  // Si no hay libro, no renderiza nada
  if (!book) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      {/* Header: Título del libro */}
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">{book.title}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Row>
          {/* Columna izquierda: Imagen y video */}
          <Col md={5} className="text-center mb-3 mb-md-0">
            <img
              src={book.image}
              alt={book.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: '250px', objectFit: 'contain', width: '100%' }}
              onError={(e) => {
                // Si la imagen falla, muestra placeholder
                e.target.src = 'https://via.placeholder.com/300x400?text=📚+Libro';
              }}
            />
            
            {/* Badge: Formato del libro */}
            <Badge bg={book.format === 'ebook' ? 'info' : 'secondary'} className="mt-2 d-inline-block">
              {book.format === 'ebook' ? '📱 E-book' : '📖 Físico'}
            </Badge>

            {/* Video: Si el libro tiene video */}
            {book.video && (
              <div className="mt-3">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FaVideo className="text-danger me-2" />
                  <small className="fw-bold">🎬 Vista previa del libro</small>
                </div>
                <video 
                  controls
                  width="100%"
                  style={{ borderRadius: '8px', maxHeight: '200px', backgroundColor: '#000' }}
                >
                  <source src={book.video} type="video/mp4" />
                  <p className="text-white p-3">Tu navegador no soporta el elemento de video.</p>
                </video>
              </div>
            )}
          </Col>

          {/* Columna derecha: Detalles del libro */}
          <Col md={7}>
            <h4 className="text-primary">{book.author}</h4>
            <div className="mb-3">
              <Badge bg="warning" className="me-1">{book.category}</Badge>
              <Badge bg="secondary">{book.year}</Badge>
            </div>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              {book.description}
            </p>
            
            <div className="border-top pt-3 mt-3">
              <Row>
                <Col xs={6}>
                  <p><FaFileAlt className="me-2" />{book.pages} páginas</p>
                </Col>
                <Col xs={6}>
                  <p><FaBook className="me-2" />{book.format === 'ebook' ? 'Digital' : 'Físico'}</p>
                </Col>
              </Row>
            </div>

            {/* Precio y botón agregar */}
            <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3">
              <span className="price display-6">${book.price.toLocaleString()}</span>
              <Button 
                variant="primary" 
                onClick={() => {
                  onAddToCart(book); // Agrega al carrito
                  onClose(); // Cierra el modal
                }}
              >
                <FaShoppingCart className="me-2" /> Agregar al carrito
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      
      {/* Footer: Botón cerrar */}
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onClose}>
          <FaTimes className="me-2" /> Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookModal;