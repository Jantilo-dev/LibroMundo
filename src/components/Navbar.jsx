// ==========================================
// IMPORTACIONES
// ==========================================

import React, { useState } from 'react';
// useState: Hook para manejar estado del menú móvil

import { Navbar, Nav, Container, Badge, Dropdown, Button } from 'react-bootstrap';
// Componentes de Bootstrap

import { FaBook, FaShoppingCart, FaBars, FaTrash } from 'react-icons/fa';
// Íconos de Font Awesome

import { Link, useNavigate } from 'react-router-dom';
// Link: Navegación sin recargar | useNavigate: Navegar desde código

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const NavbarComponent = ({ cartCount = 0, cartItems = [], removeFromCart = null }) => {
  // Props que recibe del padre (App.jsx):
  // cartCount: Número de items en el carrito
  // cartItems: Array con los libros en el carrito
  // removeFromCart: Función para eliminar un libro

  // Estado para controlar menú móvil (true = abierto, false = cerrado)
  const [expanded, setExpanded] = useState(false);
  
  // Hook para navegar programáticamente
  const navigate = useNavigate();

  // ==========================================
  // FUNCIONES DEL COMPONENTE
  // ==========================================

  // Función: Ir al carrito
  const handleGoToCart = () => {
    navigate('/carrito'); // Navega a la página del carrito
    setExpanded(false); // Cierra el menú móvil
  };

  // Función: Eliminar item del carrito
  const handleRemoveItem = (e, id) => {
    e.stopPropagation(); // Evita que se cierre el dropdown
    if (removeFromCart) {
      removeFromCart(id); // Llama a la función del padre
    }
  };

  // Función: Scroll suave a secciones
  const handleScrollTo = (sectionId) => {
    setExpanded(false); // Cierra menú móvil
    
    // Si no estamos en home, navega y luego hace scroll
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    
    // Si estamos en home, hace scroll directo
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // Calcula el total del carrito: suma todos los precios
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // ==========================================
  // RENDERIZADO (JSX)
  // ==========================================

  return (
    // NAVBAR: Fija en top, colapsa en móviles
    <Navbar expand="lg" className="navbar-custom" expanded={expanded} sticky="top">
      <Container>
        
        {/* ===== LOGO DE LA TIENDA ===== */}
        {/* CORREGIDO: Agregué el > que faltaba */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center" 
          onClick={() => setExpanded(false)}
        >
          <FaBook className="me-2" size={28} />
          <span>LibroMundo</span>
        </Navbar.Brand>

        {/* ===== BOTÓN MENÚ MÓVIL ===== */}
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        >
          <FaBars size={24} />
        </Navbar.Toggle>

        {/* ===== ENLACES DE NAVEGACIÓN ===== */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            {/* Enlace: Inicio */}
            <Nav.Link 
              onClick={() => handleScrollTo('home')} 
              className="nav-link" 
              style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
            >
              Inicio
            </Nav.Link>
            
            {/* Enlace: Libros */}
            <Nav.Link 
              onClick={() => handleScrollTo('libros')} 
              className="nav-link" 
              style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
            >
              Libros
            </Nav.Link>
            
            {/* Enlace: FAQ */}
            <Nav.Link 
              onClick={() => handleScrollTo('faq')} 
              className="nav-link" 
              style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
            >
              FAQ
            </Nav.Link>
            
            {/* Enlace: Newsletter */}
            <Nav.Link 
              onClick={() => handleScrollTo('newsletter')} 
              className="nav-link" 
              style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
            >
              Newsletter
            </Nav.Link>

            {/* Enlace: Admin */}
            <Nav.Link 
              as={Link} 
              to="/admin" 
              className="nav-link" 
              style={{ color: 'rgba(255,255,255,0.8)' }}
              onClick={() => setExpanded(false)}
            >
              Admin
            </Nav.Link>

            {/* ===== DROPDOWN DEL CARRITO ===== */}
            <Dropdown align="end" className="ms-2">
              
              {/* Botón del carrito */}
              <Dropdown.Toggle 
                variant="link" 
                className="text-white p-0 border-0 position-relative" 
                id="cart-dropdown"
              >
                <FaShoppingCart size={22} />
                
                {/* Badge: Muestra número de items (solo si hay) */}
                {cartCount > 0 && (
                  <Badge 
                    bg="danger" 
                    className="cart-badge position-absolute top-0 start-100 translate-middle"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Dropdown.Toggle>

              {/* Contenido del dropdown */}
              <Dropdown.Menu className="p-3" style={{ minWidth: '320px', maxWidth: '400px' }}>
                
                {/* Título del dropdown */}
                <h6 className="mb-3 border-bottom pb-2">
                  <FaShoppingCart className="me-2" />
                  Mi Carrito ({cartCount} items)
                </h6>

                {/* ===== RENDERIZADO CONDICIONAL ===== */}
                {/* Si el carrito está vacío */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">🛒 Tu carrito está vacío</p>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mt-2" 
                      onClick={() => { navigate('/'); setExpanded(false); }}
                    >
                      Ir a comprar
                    </Button>
                  </div>
                ) : (
                  // Si el carrito tiene items
                  <>
                    {/* Lista de items (máximo 5) */}
                    <div className="cart-items-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {cartItems.slice(0, 5).map((item) => (
                        <div 
                          key={item.id} 
                          className="d-flex align-items-center justify-content-between py-2 border-bottom"
                        >
                          <div className="d-flex align-items-center">
                            {/* Imagen miniatura */}
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              style={{ 
                                width: '40px', 
                                height: '50px', 
                                objectFit: 'cover', 
                                borderRadius: '4px', 
                                marginRight: '10px' 
                              }} 
                            />
                            <div>
                              <div className="fw-bold small">{item.title}</div>
                              <div className="text-muted small">${item.price.toLocaleString()}</div>
                            </div>
                          </div>
                          {/* Botón eliminar */}
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={(e) => handleRemoveItem(e, item.id)} 
                            className="p-1"
                          >
                            <FaTrash size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Mensaje si hay más de 5 items */}
                    {cartItems.length > 5 && (
                      <div className="text-center text-muted small py-1">
                        + {cartItems.length - 5} más...
                      </div>
                    )}

                    {/* ===== FOOTER DEL DROPDOWN ===== */}
                    <div className="border-top pt-2 mt-2">
                      
                      {/* Total del carrito */}
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span className="text-primary">${total.toLocaleString()}</span>
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="d-flex gap-2 mt-2">
                        
                        {/* CORREGIDO: onclick → onClick */}
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="flex-grow-1" 
                          onClick={() => { navigate('/'); setExpanded(false); }}
                        >
                          Seguir comprando
                        </Button>
                        
                        {/* CORREGIDO: 
                            - onclick → onClick
                            - variant="primary"size="sm" → variant="primary" size="sm"
                            - className="flex-grow-1"onclick → className="flex-grow-1" onClick
                            - Vercarrito → Ver carrito
                        */}
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="flex-grow-1" 
                          onClick={handleGoToCart}
                        >
                          Ver carrito
                        </Button>
                        
                      </div>
                    </div>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// ==========================================
// EXPORTACIÓN
// ==========================================

export default NavbarComponent;