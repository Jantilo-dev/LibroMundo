"""
Capa de dominio: contrato de los repositorios.

Definen las operaciones que cada repositorio debe ofrecer,
sin importar la tecnologia con la que se implemente (ORM, archivo, API...).
"""

from abc import ABC, abstractmethod
from typing import Optional

from .entities import Libro, Pedido


class LibroRepository(ABC):
    @abstractmethod
    def list(self) -> list[Libro]:
        """Devuelve todos los libros."""

    @abstractmethod
    def get(self, id: int) -> Optional[Libro]:
        """Devuelve un libro por su id o None si no existe."""

    @abstractmethod
    def create(self, libro: Libro) -> Libro:
        """Persiste un libro nuevo."""

    @abstractmethod
    def update(self, libro: Libro) -> Libro:
        """Actualiza un libro existente."""

    @abstractmethod
    def delete(self, id: int) -> None:
        """Elimina un libro por su id."""


class PedidoRepository(ABC):
    @abstractmethod
    def list(self) -> list[Pedido]:
        """Devuelve todos los pedidos."""

    @abstractmethod
    def get(self, id: int) -> Optional[Pedido]:
        """Devuelve un pedido por su id o None si no existe."""

    @abstractmethod
    def create(self, pedido: Pedido) -> Pedido:
        """Persiste un pedido nuevo."""

    @abstractmethod
    def update(self, pedido: Pedido) -> Pedido:
        """Actualiza un pedido existente."""

    @abstractmethod
    def delete(self, id: int) -> None:
        """Elimina un pedido por su id."""