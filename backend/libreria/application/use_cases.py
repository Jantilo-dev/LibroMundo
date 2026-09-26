"""
APPLICATION RING (Casos de uso)
----------------------------------
Aca vive la LOGICA DE NEGOCIO/ORQUESTACION: que se hace con cada
peticion, en que orden, y que reglas se validan. Cada caso de uso
recibe un repositorio (el puerto, no una implementacion concreta)
por constructor -> inyeccion de dependencias: el caso de uso no sabe
si por debajo hay Django ORM, un mock para tests, o cualquier otra cosa.
"""

from typing import List

from ..domain.entities import Libro, Pedido
from ..domain.repositories import LibroRepository, PedidoRepository
from .exceptions import (
    EstadoInvalidoError,
    LibroDuplicadoError,
    LibroNoEncontradoError,
    PedidoNoEncontradoError,
)


# ------------------------------------------------------------------
# LIBROS
# ------------------------------------------------------------------

class ListarLibrosUseCase:
    def __init__(self, repo: LibroRepository):
        self.repo = repo

    def ejecutar(self) -> List[Libro]:
        return self.repo.listar()


class ObtenerLibroUseCase:
    def __init__(self, repo: LibroRepository):
        self.repo = repo

    def ejecutar(self, libro_id: int) -> Libro:
        libro = self.repo.obtener_por_id(libro_id)
        if libro is None:
            raise LibroNoEncontradoError(f"No existe un libro con id {libro_id}")
        return libro


class CrearLibroUseCase:
    def __init__(self, repo: LibroRepository):
        self.repo = repo

    def ejecutar(self, datos: dict) -> Libro:
        if self.repo.existe_titulo(datos["title"]):
            raise LibroDuplicadoError(f"Ya existe un libro con el titulo '{datos['title']}'")

        libro = Libro(
            id=None,
            title=datos["title"],
            author=datos["author"],
            price=datos["price"],
            category=datos["category"],
            format=datos["format"],
            image=datos["image"],
            description=datos["description"],
            year=datos["year"],
            pages=datos["pages"],
            video=datos.get("video", ""),
        )
        return self.repo.guardar(libro)


class ActualizarLibroUseCase:
    def __init__(self, repo: LibroRepository):
        self.repo = repo

    def ejecutar(self, libro_id: int, datos: dict) -> Libro:
        libro = self.repo.obtener_por_id(libro_id)
        if libro is None:
            raise LibroNoEncontradoError(f"No existe un libro con id {libro_id}")

        for campo in (
            "title", "author", "price", "category", "format",
            "image", "description", "year", "pages", "video",
        ):
            setattr(libro, campo, datos.get(campo, getattr(libro, campo)))

        return self.repo.guardar(libro)


class EliminarLibroUseCase:
    def __init__(self, repo: LibroRepository):
        self.repo = repo

    def ejecutar(self, libro_id: int) -> None:
        eliminado = self.repo.eliminar(libro_id)
        if not eliminado:
            raise LibroNoEncontradoError(f"No existe un libro con id {libro_id}")


# ------------------------------------------------------------------
# PEDIDOS
# ------------------------------------------------------------------

class ListarPedidosUseCase:
    def __init__(self, repo: PedidoRepository):
        self.repo = repo

    def ejecutar(self) -> List[Pedido]:
        return self.repo.listar()


class ObtenerPedidoUseCase:
    def __init__(self, repo: PedidoRepository):
        self.repo = repo

    def ejecutar(self, pedido_id: int) -> Pedido:
        pedido = self.repo.obtener_por_id(pedido_id)
        if pedido is None:
            raise PedidoNoEncontradoError(f"No existe un pedido con id {pedido_id}")
        return pedido


class CrearPedidoUseCase:
    def __init__(self, repo: PedidoRepository):
        self.repo = repo

    def ejecutar(self, datos: dict) -> Pedido:
        if datos.get("total", 0) < 0:
            raise EstadoInvalidoError("El total no puede ser negativo")

        cliente = datos.get("cliente", {})
        items = datos.get("items", [])
        libro_id = datos.get("libro")
        if not libro_id and items:
            libro_id = items[0].get("libroId")

        pedido = Pedido(
            id=None,
            libro=libro_id,
            cliente_nombre=cliente.get("nombre", ""),
            cliente_email=cliente.get("email", ""),
            cliente_direccion=cliente.get("direccion", ""),
            items=items,
            total=datos.get("total", 0),
            metodo_entrega=datos.get("metodoEntrega", "despacho a domicilio"),
            estado=datos.get("estado", "pendiente"),
            fecha=self._a_iso(datos.get("fecha")),
        )
        return self.repo.guardar(pedido)

    @staticmethod
    def _a_iso(fecha) -> str:
        if not fecha:
            return ""
        return fecha.isoformat() if hasattr(fecha, "isoformat") else str(fecha)


class ActualizarPedidoUseCase:
    """Actualiza un pedido (acepta datos parciales) y valida la
    transicion de estados."""

    TRANSICIONES = {
        "pendiente": {"confirmado", "cancelado"},
        "confirmado": {"enviado", "cancelado"},
        "enviado": {"completado", "cancelado"},
        "completado": set(),
        "cancelado": set(),
    }

    def __init__(self, repo: PedidoRepository):
        self.repo = repo

    def ejecutar(self, pedido_id: int, datos: dict) -> Pedido:
        pedido = self.repo.obtener_por_id(pedido_id)
        if pedido is None:
            raise PedidoNoEncontradoError(f"No existe un pedido con id {pedido_id}")

        nuevo_estado = datos.get("estado", pedido.estado)
        if nuevo_estado != pedido.estado and nuevo_estado not in self.TRANSICIONES.get(pedido.estado, set()):
            raise EstadoInvalidoError(
                f"No se puede pasar de '{pedido.estado}' a '{nuevo_estado}'"
            )

        cliente = datos.get("cliente", {})
        fecha = datos.get("fecha")

        pedido.libro = datos.get("libro", pedido.libro)
        pedido.cliente_nombre = cliente.get("nombre", pedido.cliente_nombre)
        pedido.cliente_email = cliente.get("email", pedido.cliente_email)
        pedido.cliente_direccion = cliente.get("direccion", pedido.cliente_direccion)
        pedido.items = datos.get("items", pedido.items)
        pedido.total = datos.get("total", pedido.total)
        pedido.metodo_entrega = datos.get("metodoEntrega", pedido.metodo_entrega)
        pedido.estado = nuevo_estado
        if fecha:
            pedido.fecha = fecha.isoformat() if hasattr(fecha, "isoformat") else str(fecha)

        return self.repo.guardar(pedido)


class EliminarPedidoUseCase:
    def __init__(self, repo: PedidoRepository):
        self.repo = repo

    def ejecutar(self, pedido_id: int) -> None:
        eliminado = self.repo.eliminar(pedido_id)
        if not eliminado:
            raise PedidoNoEncontradoError(f"No existe un pedido con id {pedido_id}")