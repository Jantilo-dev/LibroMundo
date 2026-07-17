// ==========================================
// IMPORTACIONES
// ==========================================

import React, { useState } from 'react';
// useState: Maneja el estado global del carrito

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
  // Estado global del carrito (compartido entre todos los componentes)
  const [cartCount, setCartCount] = useState(0);
  // cartCount: Número total de items
  // setCartCount: Función para actualizar el contador

  const [cartItems, setCartItems] = useState([]);
  // cartItems: Array con los libros en el carrito
  // setCartItems: Función para agregar/eliminar libros

  // Función: Eliminar un libro del carrito por su ID
  const removeFromCart = (id) => {
    // filter: Crea nuevo array sin el libro con ese ID
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart); // Actualiza el array
    setCartCount(newCart.length); // Actualiza el contador
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
              setCartCount={setCartCount}
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
            setCartCount={setCartCount}
          />
        } />
      </Routes>

      {/* Footer: Visible en todas las páginas */}
      <Footer />
    </>
  );
}

export default App;