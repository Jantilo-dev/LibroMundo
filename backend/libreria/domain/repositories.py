"""
PUERTO (Port) de salida
-------------------------
Es un CONTRATO (interfaz abstracta), no una implementacion. El
dominio y los casos de uso dependen de ESTA interfaz, nunca de
Django ORM directamente (principio de inversion de dependencias).
Quien implemente esta interfaz (en infrastructure/) es un
"adaptador secundario" (driven adapter) - hoy puede ser Django
ORM + SQLite, mañana podria ser MongoDB, sin que la logica de
negocio se entere.
"""

from abc import ABC, abstractmethod
from typing import Optional

from .entities import Libro, Pedido


class LibroRepository(ABC):
    @abstractmethod
    def listar(self) -> list[Libro]:
        """Devuelve todos los libros."""

    @abstractmethod
    def obtener_por_id(self, libro_id: int) -> Optional[Libro]:
        """Devuelve un libro por su id o None si no existe."""

    @abstractmethod
    def existe_titulo(self, titulo: str) -> bool:
        """Indica si ya existe un libro con ese titulo."""

    @abstractmethod
    def guardar(self, libro: Libro) -> Libro:
        """Crea el libro si no tiene id, o lo actualiza si ya existe."""

    @abstractmethod
    def eliminar(self, libro_id: int) -> bool:
        """Elimina un libro. Devuelve True si se elimino algo."""


class PedidoRepository(ABC):
    @abstractmethod
    def listar(self) -> list[Pedido]:
        """Devuelve todos los pedidos."""

    @abstractmethod
    def obtener_por_id(self, pedido_id: int) -> Optional[Pedido]:
        """Devuelve un pedido por su id o None si no existe."""

    @abstractmethod
    def guardar(self, pedido: Pedido) -> Pedido:
        """Crea el pedido si no tiene id, o lo actualiza si ya existe."""

    @abstractmethod
    def eliminar(self, pedido_id: int) -> bool:
        """Elimina un pedido. Devuelve True si se elimino algo."""