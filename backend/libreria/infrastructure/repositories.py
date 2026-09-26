"""
Implementacion concreta de los repositorios sobre el ORM de Django.

Traducen entre las entidades (capa domain) y los modelos (infrastructure).
"""

from datetime import date, datetime
from typing import Optional

from django.shortcuts import get_object_or_404

from ..domain.entities import Libro, Pedido
from ..domain.repositories import LibroRepository, PedidoRepository
from . import models as orm


class ORMLibroRepository(LibroRepository):
    """Repositorio de Libro sobre el ORM."""

    def list(self) -> list[Libro]:
        return [self._to_entity(obj) for obj in orm.Libro.objects.all()]

    def get(self, id: int) -> Optional[Libro]:
        try:
            return self._to_entity(orm.Libro.objects.get(pk=id))
        except orm.Libro.DoesNotExist:
            return None

    def create(self, libro: Libro) -> Libro:
        obj = orm.Libro.objects.create(
            title=libro.title,
            author=libro.author,
            price=libro.price,
            category=libro.category,
            format=libro.format,
            image=libro.image,
            description=libro.description,
            year=libro.year,
            pages=libro.pages,
            video=libro.video,
        )
        return self._to_entity(obj)

    def update(self, libro: Libro) -> Libro:
        obj = get_object_or_404(orm.Libro, pk=libro.id)
        for field in (
            "title", "author", "price", "category", "format",
            "image", "description", "year", "pages", "video",
        ):
            setattr(obj, field, getattr(libro, field))
        obj.save()
        return self._to_entity(obj)

    def delete(self, id: int) -> None:
        orm.Libro.objects.filter(pk=id).delete()

    @staticmethod
    def _to_entity(obj: orm.Libro) -> Libro:
        return Libro(
            id=obj.pk,
            title=obj.title,
            author=obj.author,
            price=obj.price,
            category=obj.category,
            format=obj.format,
            image=obj.image,
            description=obj.description,
            year=obj.year,
            pages=obj.pages,
            video=obj.video,
        )


class ORMPedidoRepository(PedidoRepository):
    """Repositorio de Pedido sobre el ORM."""

    def list(self) -> list[Pedido]:
        qs = orm.Pedido.objects.select_related("libro").all()
        return [self._to_entity(obj) for obj in qs]

    def get(self, id: int) -> Optional[Pedido]:
        try:
            return self._to_entity(orm.Pedido.objects.get(pk=id))
        except orm.Pedido.DoesNotExist:
            return None

    def create(self, pedido: Pedido) -> Pedido:
        obj = orm.Pedido.objects.create(
            libro_id=pedido.libro,
            cliente_nombre=pedido.cliente_nombre,
            cliente_email=pedido.cliente_email,
            cliente_direccion=pedido.cliente_direccion,
            items=pedido.items,
            total=pedido.total,
            metodo_entrega=pedido.metodo_entrega,
            estado=pedido.estado,
            fecha=self._parse_fecha(pedido.fecha),
        )
        return self._to_entity(obj)

    def update(self, pedido: Pedido) -> Pedido:
        obj = get_object_or_404(orm.Pedido, pk=pedido.id)
        obj.libro_id = pedido.libro
        obj.cliente_nombre = pedido.cliente_nombre
        obj.cliente_email = pedido.cliente_email
        obj.cliente_direccion = pedido.cliente_direccion
        obj.items = pedido.items
        obj.total = pedido.total
        obj.metodo_entrega = pedido.metodo_entrega
        obj.estado = pedido.estado
        obj.fecha = self._parse_fecha(pedido.fecha)
        obj.save()
        return self._to_entity(obj)

    def delete(self, id: int) -> None:
        orm.Pedido.objects.filter(pk=id).delete()

    @staticmethod
    def _parse_fecha(fecha: str) -> Optional[date]:
        if not fecha:
            return None
        if isinstance(fecha, (date, datetime)):
            return fecha
        return datetime.strptime(fecha, "%Y-%m-%d").date()

    @staticmethod
    def _to_entity(obj: orm.Pedido) -> Pedido:
        fecha = obj.fecha
        if isinstance(fecha, (date, datetime)):
            fecha = fecha.isoformat()
        return Pedido(
            id=obj.pk,
            libro=obj.libro_id,
            cliente_nombre=obj.cliente_nombre,
            cliente_email=obj.cliente_email,
            cliente_direccion=obj.cliente_direccion,
            items=obj.items,
            total=obj.total,
            metodo_entrega=obj.metodo_entrega,
            estado=obj.estado,
            fecha=fecha or "",
        )