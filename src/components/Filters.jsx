// ==========================================
// IMPORTACIONES
// ==========================================

import React from 'react';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
// Row, Col: Sistema de grid | ButtonGroup: Grupo de botones

import { categories, formats } from '../data/booksData';
// Datos de categorías y formatos

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const Filters = ({ selectedCategory, selectedFormat, onCategoryChange, onFormatChange }) => {
  // Props:
  // selectedCategory: Categoría actualmente seleccionada
  // selectedFormat: Formato actualmente seleccionado
  // onCategoryChange: Función al cambiar categoría
  // onFormatChange: Función al cambiar formato

  return (
    <Row className="mb-4">
      {/* Columna: Filtro de categorías */}
      <Col xs={12} md={6} className="mb-3 mb-md-0">
        <h6 className="fw-bold">Categoría:</h6>
        <ButtonGroup aria-label="Categorías" className="flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              // Si está seleccionado: fondo azul | Si no: borde azul
              variant={selectedCategory === category.id ? 'primary' : 'outline-primary'}
              onClick={() => onCategoryChange(category.id)}
              className="mb-1"
              size="sm"
            >
              {category.label}
            </Button>
          ))}
        </ButtonGroup>
      </Col>
      
      {/* Columna: Filtro de formatos */}
      <Col xs={12} md={6}>
        <h6 className="fw-bold">Formato:</h6>
        <ButtonGroup aria-label="Formatos" className="flex-wrap">
          {formats.map((format) => (
            <Button
              key={format.id}
              // Si está seleccionado: fondo verde | Si no: borde verde
              variant={selectedFormat === format.id ? 'success' : 'outline-success'}
              onClick={() => onFormatChange(format.id)}
              className="mb-1"
              size="sm"
            >
              {format.label}
            </Button>
          ))}
        </ButtonGroup>
      </Col>
    </Row>
  );
};

export default Filters;