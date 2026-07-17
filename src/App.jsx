// ==========================================
// IMPORTACIONES
// ==========================================

import React, { useState, useEffect } from 'react';
// useState: Maneja el estado global del carrito
// useEffect: Persiste el carrito en localStorage

import { Routes, Route } from 'react-router-dom';
// Routes y Route: Sistema de enrutamiento (Home y Carrito)

import NavbarComponent from './components/Navbar';
import Hero from './components/Hero';
import BookCarousel from './components/BookCarousel';
import BookGrid from './components/BookGrid';
import FAQAccordion from './components/FAQAccordion';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartPage from './components/CartPage';
// Todos los componentes de la aplicación

import './styles/custom.css';
// Estilos personalizados

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function App() {
  // Estado del carrito: se inicializa desde localStorage si hay datos guardados
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('libromundo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // cartCount: derivado de cartItems, no necesita estado propio
  const cartCount = cartItems.length;

  // Persiste el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('libromundo_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Función: Eliminar un libro del carrito por su ID
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      {/* Navbar: Recibe props del carrito para mostrar en el dropdown */}
      <NavbarComponent 
        cartCount={cartCount} 
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />

      {/* Sistema de rutas */}
      <Routes>
        {/* Ruta principal: Muestra todas las secciones */}
        <Route path="/" element={
          <>
            <Hero />
            <BookCarousel />
            {/* BookGrid: Recibe props para manejar el carrito */}
            <BookGrid 
              cartCount={cartCount}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
            <FAQAccordion />
            <Newsletter />
          </>
        } />
        
        {/* Ruta del carrito: Página completa para gestionar compras */}
        <Route path="/carrito" element={
          <CartPage 
            cartItems={cartItems}
            setCartItems={setCartItems}
            cartCount={cartCount}
          />
        } />
      </Routes>

      {/* Footer: Visible en todas las páginas */}
      <Footer />
    </>
  );
}

export default App;