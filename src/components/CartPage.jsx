// ==========================================
// IMPORTACIONES
// ==========================================

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createPedido } from '../services/api';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const CartPage = ({ cartItems = [], setCartItems, cartCount }) => {
  // Props del carrito desde App

  const navigate = useNavigate();
  
  // Estados del checkout
  const [showCheckout, setShowCheckout] = useState(false);
  // showCheckout: Muestra formulario de pago

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    metodoPago: 'tarjeta',
    metodoEntrega: 'despacho a domicilio'
  });
  // formData: Datos del cliente

  const [formValidated, setFormValidated] = useState(false);
  // formValidated: Controla validación del formulario

  const [orderPlaced, setOrderPlaced] = useState(false);
  // orderPlaced: Pedido realizado con éxito

  const [enviando, setEnviando] = useState(false);
  // enviando: Estado de carga mientras se envia al API

  const [error, setError] = useState(null);
  // error: Mensaje de error del servidor

  // Calcula total sumando precios
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Función: Eliminar libro del carrito
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Función: Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Función: Volver a la tienda
  const goBackToShop = () => {
    navigate('/');
  };

  // Función: Manejar cambios en formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función: Enviar formulario (finalizar compra)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setFormValidated(true);
      return;
    }

    setFormValidated(true);
    setError(null);
    setEnviando(true);

    // Arma el body segun el schema del API
    const body = {
      cliente: {
        nombre: formData.nombre,
        email: formData.email,
        direccion: formData.direccion,
      },
      items: cartItems.map(item => ({
        libroId: String(item.id),
        titulo: item.title,
        precio: item.price,
        cantidad: 1,
      })),
      total: cartItems.reduce((sum, item) => sum + item.price, 0),
      metodoEntrega: formData.metodoEntrega,
      estado: 'pendiente',
      fecha: new Date().toISOString().split('T')[0],
    };

    try {
      await createPedido(body);
      setOrderPlaced(true);
      alert('Pedido realizado con exito!');
      setCartItems([]);
      setOrderPlaced(false);
      setShowCheckout(false);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Error al procesar el pedido.');
    } finally {
      setEnviando(false);
    }
  };

  // Función: Cancelar compra
  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar la compra?')) {
      setShowCheckout(false);
      setFormValidated(false);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        metodoPago: 'tarjeta',
        metodoEntrega: 'despacho a domicilio'
      });
    }
  };

  // ==========================================
  // RENDERIZADO CONDICIONAL: Carrito vacío
  // ==========================================

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-lg p-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <FaShoppingCart size={80} className="text-muted mb-4" />
          <h3>Tu carrito está vacío</h3>
          <p className="text-muted">Agrega algunos libros antes de continuar</p>
          <Button variant="primary" onClick={goBackToShop} className="mt-3">
            <FaArrowLeft className="me-2" /> Volver a la tienda
          </Button>
        </Card>
      </Container>
    );
  }

  // ==========================================
  // RENDERIZADO PRINCIPAL: Carrito con items
  // ==========================================

  return (
    <Container className="py-4">
      {/* Botón: Volver a la tienda */}
      <Button variant="outline-primary" onClick={goBackToShop} className="mb-4">
        <FaArrowLeft className="me-2" /> Seguir comprando
      </Button>

      <Row>
        {/* COLUMNA IZQUIERDA: Lista de libros */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FaShoppingCart className="me-2" />
                Carrito de Compras
              </h4>
              <span className="badge bg-light text-dark">{cartItems.length} items</span>
            </Card.Header>
            <Card.Body>
              {/* Si NO está en checkout: Muestra lista */}
              {!showCheckout ? (
                <>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Libro</th>
                        <th>Autor</th>
                        <th>Precio</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.title}</td>
                          <td>{item.author}</td>
                          <td>${item.price.toLocaleString()}</td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button variant="danger" onClick={clearCart}>
                      Vaciar carrito
                    </Button>
                    <div className="text-end">
                      <h4>Total: <span className="text-primary">${total.toLocaleString()}</span></h4>
                    </div>
                  </div>

                  <div className="text-end mt-3">
                    <Button variant="success" size="lg" onClick={() => setShowCheckout(true)}>
                      Proceder al pago
                    </Button>
                  </div>
                </>
              ) : (
                /* FORMULARIO DE CHECKOUT */
                <div>
                  <h5 className="mb-3">📋 Datos del Cliente</h5>

                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}

                  <Form noValidate validated={formValidated} onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre completo *</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa tu nombre
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa un email válido
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Teléfono *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa tu teléfono
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Dirección de envío *</Form.Label>
                          <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa tu dirección
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Método de pago *</Form.Label>
                      <Form.Select
                        name="metodoPago"
                        value={formData.metodoPago}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="tarjeta">Tarjeta de Credito/Debito</option>
                        <option value="paypal">PayPal</option>
                        <option value="transferencia">Transferencia Bancaria</option>
                        <option value="efectivo">Efectivo (Retiro en tienda)</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Metodo de entrega *</Form.Label>
                      <Form.Select
                        name="metodoEntrega"
                        value={formData.metodoEntrega}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="despacho a domicilio">Despacho a domicilio</option>
                        <option value="retiro en tienda">Retiro en tienda</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="border-top pt-3 mt-3">
                      <h5>Resumen del pedido</h5>
                      <p><strong>Total productos:</strong> {cartItems.length}</p>
                      <p><strong>Total a pagar:</strong> <span className="text-primary fw-bold">${total.toLocaleString()}</span></p>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="danger" onClick={handleCancel}>
                        ❌ Cancelar compra
                      </Button>
                      <Button variant="success" type="submit" disabled={enviando}>
                        {enviando ? 'Procesando...' : 'Finalizar compra'}
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: Resumen */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">📊 Resumen</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>IVA (19%):</span>
                <span>${(total * 0.19).toLocaleString()}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span className="text-primary">${(total * 1.19).toLocaleString()}</span>
              </div>
              {!showCheckout && (
                <Button variant="success" className="w-100 mt-3" onClick={() => setShowCheckout(true)}>
                  Ir a pagar
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;