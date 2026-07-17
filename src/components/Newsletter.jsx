// ==========================================
// IMPORTACIONES
// ==========================================

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const Newsletter = () => {
  // Estados
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Valida formato de email con regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      setValidated(true);
      return;
    }

    setError('');
    setSubmitted(true);
    setEmail('');
    setValidated(false);

    // Oculta mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section id="newsletter" className="newsletter-section">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h2 className="mb-3">📬 Suscríbete a nuestro Newsletter</h2>
            <p className="lead mb-4">
              Recibe las mejores recomendaciones, ofertas exclusivas y novedades literarias directamente en tu correo.
            </p>
            
            {/* Si ya se suscribió: Muestra mensaje de éxito */}
            {submitted ? (
              <Alert variant="success" className="text-center">
                <h5>🎉 ¡Gracias por suscribirte!</h5>
                <p>Revisa tu correo para confirmar la suscripción.</p>
              </Alert>
            ) : (
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        isInvalid={!!error}
                        className="rounded-pill"
                      />
                      <Form.Control.Feedback type="invalid">
                        {error || 'Por favor ingresa un email válido'}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Button type="submit" className="btn-subscribe w-100 rounded-pill">
                      Suscribirme 🚀
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;