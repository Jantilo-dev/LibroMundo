// ==========================================
// IMPORTACIONES
// ==========================================

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const Hero = () => {
  // Función: Scroll suave a la sección de libros
  const handleScrollToBooks = () => {
    const booksSection = document.getElementById('libros');
    if (booksSection) {
      booksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <Container>
        <Row className="align-items-center">
          {/* Columna izquierda: Texto y botón */}
          <Col lg={7} className="text-lg-start text-center">
            <h1 className="display-3 fw-bold">
              Descubre el <span style={{ color: '#f1c40f' }}>Mundo</span> de los Libros
            </h1>
            <p className="lead mb-4">
              Encuentra tu próxima lectura favorita entre miles de títulos en nuestra tienda virtual.
              Libros físicos y ebooks para todos los gustos.
            </p>
            {/* Botón: Scroll a libros */}
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleScrollToBooks}
              className="px-5 py-3 rounded-pill"
            >
              Explorar Libros <FaArrowRight className="ms-2" />
            </Button>
          </Col>
          
          {/* Columna derecha: Imagen (solo en desktop) */}
          <Col lg={5} className="d-none d-lg-block">
            <img 
              src="https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg" 
              alt="LibroMundo" 
              className="img-fluid rounded-circle shadow-lg"
              style={{ 
                maxWidth: '100%', 
                height: '300px', 
                width: '300px',
                objectFit: 'cover'
              }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;