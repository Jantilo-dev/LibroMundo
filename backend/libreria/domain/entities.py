"""
Capa de dominio: entidades puras.

Entidades definidas con dataclasses de Python estándar.
NO dependen de Django ni de ninguna libreria de infraestructura.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Libro:
    """Entidad principal: el catalogo de libros."""

    id: Optional[int]
    title: str
    author: str
    price: int
    category: str
    format: str
    image: str
    description: str
    year: int
    pages: int
    video: str = ""


@dataclass
class Pedido:
    """Entidad secundaria: documento transaccional.

    Relacionada con Libro mediante una ForeignKey (libro).
    El detalle de varios libros se guarda en ``items`` (JSON).
    """

    id: Optional[int]
    libro: Optional[int]  # id del Libro al que pertenece el pedido
    cliente_nombre: str
    cliente_email: str
    cliente_direccion: str
    items: list = field(default_factory=list)
    total: int = 0
    metodo_entrega: str = "despacho a domicilio"
    estado: str = "pendiente"
    fecha: str = ""