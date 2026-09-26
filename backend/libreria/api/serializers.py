"""
Capa api: serializers.

El serializer de Pedido acepta/entrega la misma forma anidada que usaba
el frontend con la API anterior:

    {
      "cliente": {"nombre", "email", "direccion"},
      "items": [{"libroId", "titulo", "precio", "cantidad"}],
      "total", "metodoEntrega", "estado", "fecha", "libro"
    }

Internamente se aplanan esas columnas en el modelo relacional.
"""

from rest_framework import serializers

from ..domain.entities import Pedido
from ..infrastructure.models import Libro


class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = [
            "id", "title", "author", "price", "category", "format",
            "image", "description", "year", "pages", "video",
        ]


class ClienteSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    direccion = serializers.CharField(max_length=300)


class ItemSerializer(serializers.Serializer):
    libroId = serializers.IntegerField(required=False, allow_null=True)
    titulo = serializers.CharField(max_length=200)
    precio = serializers.IntegerField()
    cantidad = serializers.IntegerField()


class PedidoSerializer(serializers.Serializer):
    """Valida la forma anidada del frontend y la traduce a entidad."""

    ESTADOS = ["pendiente", "confirmado", "enviado", "completado", "cancelado"]

    id = serializers.IntegerField(read_only=True)
    libro = serializers.IntegerField(required=False, allow_null=True)
    cliente = ClienteSerializer()
    items = serializers.ListField(child=ItemSerializer(), required=False, default=list)
    total = serializers.IntegerField()
    metodoEntrega = serializers.CharField(max_length=50)
    estado = serializers.ChoiceField(choices=ESTADOS, default="pendiente")
    fecha = serializers.DateField(required=False, allow_null=True)

    @classmethod
    def to_entity(cls, data: dict) -> Pedido:
        """Convierte datos validados (forma frontend) en una entidad Pedido."""
        items = data.get("items", [])
        libro_id = data.get("libro")
        if not libro_id and items:
            libro_id = items[0].get("libroId")

        cliente = data.get("cliente", {})
        fecha = data.get("fecha")
        return Pedido(
            id=data.get("id"),
            libro=libro_id,
            cliente_nombre=cliente.get("nombre", ""),
            cliente_email=cliente.get("email", ""),
            cliente_direccion=cliente.get("direccion", ""),
            items=items,
            total=data.get("total", 0),
            metodo_entrega=data.get("metodoEntrega", "despacho a domicilio"),
            estado=data.get("estado", "pendiente"),
            fecha=fecha.isoformat() if fecha else "",
        )

    @staticmethod
    def to_frontend(pedido: Pedido) -> dict:
        """Convierte una entidad Pedido en la forma anidada del frontend."""
        return {
            "id": pedido.id,
            "libro": pedido.libro,
            "cliente": {
                "nombre": pedido.cliente_nombre,
                "email": pedido.cliente_email,
                "direccion": pedido.cliente_direccion,
            },
            "items": pedido.items,
            "total": pedido.total,
            "metodoEntrega": pedido.metodo_entrega,
            "estado": pedido.estado,
            "fecha": pedido.fecha,
        }