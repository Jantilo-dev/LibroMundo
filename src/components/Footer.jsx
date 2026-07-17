// ==========================================
// IMPORTACIONES
// ==========================================

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBook, FaGithub, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const Footer = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row className="py-4">
          {/* Columna 1: Logo y descripción */}
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="d-flex align-items-center">
              <FaBook className="me-2" /> LibroMundo
            </h5>
            <p className="small">
              Tu tienda virtual de libros favorita. Descubre nuevos mundos a través de la lectura.
            </p>
          </Col>
          
          {/* Columna 2: Enlaces rápidos */}
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Enlaces rápidos</h5>
            <ul className="list-unstyled small">
              <li><a href="#home">Inicio</a></li>
              <li><a href="#libros">Libros</a></li>
              <li><a href="#faq">Preguntas Frecuentes</a></li>
              <li><a href="#newsletter">Newsletter</a></li>
            </ul>
          </Col>
          
          {/* Columna 3: Redes sociales */}
          <Col md={4}>
            <h5>Síguenos</h5>
            <div className="social-icons">
              <a href="#" aria-label="GitHub"><FaGithub /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Email"><FaEnvelope /></a>
            </div>
            <p className="small mt-2">
              <FaEnvelope className="me-1" /> contacto@libromundo.cl
            </p>
          </Col>
        </Row>
        
        {/* Copyright */}
        <Row>
          <Col className="text-center border-top pt-3">
            <small>
              © {new Date().getFullYear()} LibroMundo - Todos los derechos reservados
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;