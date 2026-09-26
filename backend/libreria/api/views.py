"""
Capa api: vistas.

Las vistas NO contienen logica de negocio: delegan en los servicios
de la capa application y se encargan solo de entrada/salida HTTP.
"""

from rest_framework import status, viewsets
from rest_framework.response import Response

from ..application.services import LibroService, PedidoService
from ..domain.entities import Libro, Pedido
from ..infrastructure.repositories import ORMLibroRepository, ORMPedidoRepository
from .serializers import LibroSerializer, PedidoSerializer


class LibroViewSet(viewsets.ViewSet):
    """CRUD completo de libros (entidad principal)."""

    @property
    def service(self) -> LibroService:
        return LibroService(ORMLibroRepository())

    def list(self, request):
        libros = self.service.get_all()
        return Response(LibroSerializer(libros, many=True).data)

    def retrieve(self, request, pk=None):
        libro = self.service.get(pk)
        if not libro:
            return Response({"detail": "No encontrado."}, status=status.HTTP_404_NOT_FOUND)
        return Response(LibroSerializer(libro).data)

    def create(self, request):
        serializer = LibroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entity = Libro(id=None, **serializer.validated_data)
        created = self.service.create(entity)
        return Response(LibroSerializer(created).data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        existing = self.service.get(pk)
        if not existing:
            return Response({"detail": "No encontrado."}, status=status.HTTP_404_NOT_FOUND)
        serializer = LibroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entity = Libro(id=existing.id, **serializer.validated_data)
        updated = self.service.update(entity)
        return Response(LibroSerializer(updated).data)

    def destroy(self, request, pk=None):
        self.service.delete(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PedidoViewSet(viewsets.ViewSet):
    """CRUD completo de pedidos (entidad secundaria)."""

    @property
    def service(self) -> PedidoService:
        return PedidoService(ORMPedidoRepository())

    def list(self, request):
        pedidos = self.service.get_all()
        datos = [PedidoSerializer.to_frontend(p) for p in pedidos]
        return Response({"datos": datos})

    def retrieve(self, request, pk=None):
        pedido = self.service.get(pk)
        if not pedido:
            return Response({"detail": "No encontrado."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"datos": PedidoSerializer.to_frontend(pedido)})

    def create(self, request):
        serializer = PedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entity = PedidoSerializer.to_entity(serializer.validated_data)
        created = self.service.create(entity)
        return Response(
            PedidoSerializer.to_frontend(created),
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, pk=None):
        existing = self.service.get(pk)
        if not existing:
            return Response({"detail": "No encontrado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PedidoSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        patch = serializer.validated_data
        cliente = patch.get("cliente", {})
        fecha = patch.get("fecha")

        entity = Pedido(
            id=existing.id,
            libro=patch.get("libro", existing.libro),
            cliente_nombre=cliente.get("nombre", existing.cliente_nombre),
            cliente_email=cliente.get("email", existing.cliente_email),
            cliente_direccion=cliente.get("direccion", existing.cliente_direccion),
            items=patch.get("items", existing.items),
            total=patch.get("total", existing.total),
            metodo_entrega=patch.get("metodoEntrega", existing.metodo_entrega),
            estado=patch.get("estado", existing.estado),
            fecha=fecha.isoformat() if fecha else existing.fecha,
        )
        updated = self.service.update(entity)
        return Response(PedidoSerializer.to_frontend(updated))

    def destroy(self, request, pk=None):
        self.service.delete(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)