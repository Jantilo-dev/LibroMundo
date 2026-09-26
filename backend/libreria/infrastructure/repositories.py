"""
ADAPTADOR SECUNDARIO (Driven Adapter)
----------------------------------------
Implementacion CONCRETA de los puertos LibroRepository y
PedidoRepository usando Django ORM + SQLite. Traduce entre las
entidades de dominio (dataclasses puras) y los modelos de
persistencia (LibroModel, PedidoModel).
"""

from datetime import date, datetime
from typing import List, Optional

from ..domain.entities import Libro, Pedido
from ..domain.repositories import LibroRepository, PedidoRepository
from .models import LibroModel, PedidoModel


def _libro_a_entidad(m: LibroModel) -> Libro:
    return Libro(
        id=m.id,
        title=m.title,
        author=m.author,
        price=m.price,
        category=m.category,
        format=m.format,
        image=m.image,
        description=m.description,
        year=m.year,
        pages=m.pages,
        video=m.video,
    )


def _pedido_a_entidad(m: PedidoModel) -> Pedido:
    fecha = m.fecha
    if isinstance(fecha, (date, datetime)):
        fecha = fecha.isoformat()
    return Pedido(
        id=m.id,
        libro=m.libro_id,
        cliente_nombre=m.cliente_nombre,
        cliente_email=m.cliente_email,
        cliente_direccion=m.cliente_direccion,
        items=m.items,
        total=m.total,
        metodo_entrega=m.metodo_entrega,
        estado=m.estado,
        fecha=fecha or "",
    )


def _parse_fecha(fecha: str) -> Optional[date]:
    if not fecha:
        return None
    if isinstance(fecha, (date, datetime)):
        return fecha
    return datetime.strptime(fecha, "%Y-%m-%d").date()


class DjangoLibroRepository(LibroRepository):

    def listar(self) -> List[Libro]:
        return [_libro_a_entidad(m) for m in LibroModel.objects.all()]

    def obtener_por_id(self, libro_id: int) -> Optional[Libro]:
        m = LibroModel.objects.filter(id=libro_id).first()
        return _libro_a_entidad(m) if m else None

    def existe_titulo(self, titulo: str) -> bool:
        return LibroModel.objects.filter(title__iexact=titulo).exists()

    def guardar(self, libro: Libro) -> Libro:
        if libro.id is None:
            m = LibroModel.objects.create(
                title=libro.title, author=libro.author, price=libro.price,
                category=libro.category, format=libro.format, image=libro.image,
                description=libro.description, year=libro.year,
                pages=libro.pages, video=libro.video,
            )
        else:
            m = LibroModel.objects.get(id=libro.id)
            m.title, m.author, m.price = libro.title, libro.author, libro.price
            m.category, m.format, m.image = libro.category, libro.format, libro.image
            m.description, m.year, m.pages = libro.description, libro.year, libro.pages
            m.video = libro.video
            m.save()
        return _libro_a_entidad(m)

    def eliminar(self, libro_id: int) -> bool:
        borrados, _ = LibroModel.objects.filter(id=libro_id).delete()
        return borrados > 0


class DjangoPedidoRepository(PedidoRepository):

    def listar(self) -> List[Pedido]:
        qs = PedidoModel.objects.select_related("libro").all()
        return [_pedido_a_entidad(m) for m in qs]

    def obtener_por_id(self, pedido_id: int) -> Optional[Pedido]:
        m = PedidoModel.objects.filter(id=pedido_id).first()
        return _pedido_a_entidad(m) if m else None

    def guardar(self, pedido: Pedido) -> Pedido:
        if pedido.id is None:
            m = PedidoModel.objects.create(
                libro_id=pedido.libro,
                cliente_nombre=pedido.cliente_nombre,
                cliente_email=pedido.cliente_email,
                cliente_direccion=pedido.cliente_direccion,
                items=pedido.items,
                total=pedido.total,
                metodo_entrega=pedido.metodo_entrega,
                estado=pedido.estado,
                fecha=_parse_fecha(pedido.fecha),
            )
        else:
            m = PedidoModel.objects.get(id=pedido.id)
            m.libro_id = pedido.libro
            m.cliente_nombre = pedido.cliente_nombre
            m.cliente_email = pedido.cliente_email
            m.cliente_direccion = pedido.cliente_direccion
            m.items = pedido.items
            m.total = pedido.total
            m.metodo_entrega = pedido.metodo_entrega
            m.estado = pedido.estado
            m.fecha = _parse_fecha(pedido.fecha)
            m.save()
        return _pedido_a_entidad(m)

    def eliminar(self, pedido_id: int) -> bool:
        borrados, _ = PedidoModel.objects.filter(id=pedido_id).delete()
        return borrados > 0