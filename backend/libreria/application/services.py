"""
Capa de aplicacion: casos de uso (logica de negocio).

Los servicios reciben un repositorio (el contrato definido en domain)
y ejecutan la logica. Las vistas de la capa api NO contienen logica
de negocio: solo llaman a estos servicios.
"""

from typing import Optional

from ..domain.entities import Libro, Pedido
from ..domain.repositories import LibroRepository, PedidoRepository


class LibroService:
    def __init__(self, repo: LibroRepository):
        self.repo = repo

    def get_all(self) -> list[Libro]:
        return self.repo.list()

    def get(self, id: int) -> Optional[Libro]:
        return self.repo.get(id)

    def create(self, libro: Libro) -> Libro:
        return self.repo.create(libro)

    def update(self, libro: Libro) -> Libro:
        return self.repo.update(libro)

    def delete(self, id: int) -> None:
        self.repo.delete(id)


class PedidoService:
    def __init__(self, repo: PedidoRepository):
        self.repo = repo

    def get_all(self) -> list[Pedido]:
        return self.repo.list()

    def get(self, id: int) -> Optional[Pedido]:
        return self.repo.get(id)

    def create(self, pedido: Pedido) -> Pedido:
        return self.repo.create(pedido)

    def update(self, pedido: Pedido) -> Pedido:
        return self.repo.update(pedido)

    def delete(self, id: int) -> None:
        self.repo.delete(id)