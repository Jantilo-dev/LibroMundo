// ==========================================
// IMPORTACIONES
// ==========================================

import React from 'react';
// React: Necesario para crear el componente

import { Container, Accordion } from 'react-bootstrap';
// Container: Centra el contenido
// Accordion: Componente de acordeón de Bootstrap (preguntas desplegables)

import { FaQuestionCircle } from 'react-icons/fa';
// FaQuestionCircle: Ícono de signo de interrogación para el título

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const FAQAccordion = () => {
  // Datos de preguntas frecuentes (array de objetos)
  const faqs = [
    {
      id: '0',
      question: '¿Cómo puedo comprar un libro?',
      answer: 'Puedes comprar un libro navegando por nuestra colección, seleccionando el libro deseado y haciendo clic en "Agregar al carrito". Luego, procede al checkout para completar tu compra.'
    },
    {
      id: '1',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), transferencia bancaria, y PayPal. Todos los pagos son seguros y encriptados.'
    },
    {
      id: '2',
      question: '¿Cuánto tiempo tarda el envío?',
      answer: 'Los envíos a Santiago tardan 2-3 días hábiles, y a regiones 4-5 días hábiles. Los ebooks están disponibles para descarga inmediata después de la compra.'
    },
    {
      id: '3',
      question: '¿Puedo devolver un libro?',
      answer: 'Sí, tienes 15 días desde la recepción para devolver libros físicos en perfecto estado. Los ebooks no son reembolsables una vez descargados.'
    },
    {
      id: '4',
      question: '¿Tienen libros en inglés?',
      answer: 'Sí, contamos con una sección especial de libros en inglés. Puedes filtrar por idioma en nuestra búsqueda avanzada.'
    }
  ];

  return (
    // Sección con id="faq" para el scroll desde el Navbar
    <section id="faq" className="faq-section">
      <Container>
        {/* Título de la sección */}
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold" style={{ color: '#2c3e50' }}>
            <FaQuestionCircle className="me-2" style={{ color: '#3498db' }} />
            Preguntas Frecuentes
          </h2>
          <p className="text-muted">Encuentra respuestas a las dudas más comunes</p>
        </div>
        
        {/* 
          Accordion: Componente de Bootstrap
          defaultActiveKey="0": El primer acordeón (id: '0') aparece abierto por defecto
          flush: Quita los bordes entre los items del acordeón
        */}
        <Accordion defaultActiveKey="0" flush>
          {faqs.map((faq) => (
            // Accordion.Item: Cada pregunta individual
            // eventKey={faq.id}: Identificador único para controlar apertura/cierre
            <Accordion.Item eventKey={faq.id} key={faq.id}>
              {/* Accordion.Header: Encabezado de la pregunta (clic para abrir/cerrar) */}
              <Accordion.Header>
                <strong>{faq.question}</strong>
              </Accordion.Header>
              {/* Accordion.Body: Contenido de la respuesta */}
              <Accordion.Body>
                {faq.answer}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};

// ==========================================
// EXPORTACIÓN
// ==========================================

export default FAQAccordion;