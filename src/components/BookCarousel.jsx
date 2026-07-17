// ==========================================
// IMPORTACIONES
// ==========================================

import React, { useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';
// Carousel: Componente de Bootstrap para carrusel

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const BookCarousel = () => {
  // Estado: Controla el slide activo del carrusel
  const [index, setIndex] = useState(0);

  // Datos del carrusel
  const carouselItems = [
    {
      id: 1,
      image: "https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg",
      title: "Cien Años de Soledad",
      description: "La obra maestra de García Márquez"
    },
    {
      id: 2,
      image: "https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg",
      title: "El Principito",
      description: "Un clásico atemporal"
    },
    {
      id: 3,
      image: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
      title: "1984",
      description: "La distopía más famosa"
    }
  ];

  // Función: Cambia el slide activo
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <section className="carousel-container">
      <Container>
        <h2 className="text-center mb-4" style={{ color: '#2c3e50' }}>
          📖 Recomendaciones del Mes
        </h2>
        {/* Carousel: Cambio automático cada 4 segundos */}
        <Carousel activeIndex={index} onSelect={handleSelect} interval={4000}>
          {carouselItems.map((item) => (
            <Carousel.Item key={item.id}>
              <div className="d-flex justify-content-center">
                <img
                  className="d-block"
                  src={item.image}
                  alt={item.title}
                  style={{ 
                    maxHeight: '400px', 
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '10px'
                  }}
                />
              </div>
              <Carousel.Caption>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default BookCarousel;