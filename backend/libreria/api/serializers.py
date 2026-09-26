"""
Capa api: serializers.

OJO: NO son ModelSerializers atados al ORM (a proposito). Trabajan
sobre las entidades de dominio (dataclasses) para no acoplar la capa
API al detalle de persistencia. Son el "traductor" JSON <-> entidad.
"""

from rest_framework import serializers


class LibroSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200)
    author = serializers.CharField(max_length=200)
    price = serializers.IntegerField()
    category = serializers.CharField(max_length=50)
    format = serializers.CharField(max_length=10)
    image = serializers.URLField()
    description = serializers.CharField()
    year = serializers.IntegerField()
    pages = serializers.IntegerField()
    video = serializers.CharField(required=False, allow_blank=True, default="")


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
    """Valida la forma anidada que consume/entrega el frontend:

        {
          "cliente": {"nombre", "email", "direccion"},
          "items": [{"libroId", "titulo", "precio", "cantidad"}],
          "total", "metodoEntrega", "estado", "fecha", "libro"
        }
    """

    ESTADOS = ["pendiente", "confirmado", "enviado", "completado", "cancelado"]

    id = serializers.IntegerField(read_only=True)
    libro = serializers.IntegerField(required=False, allow_null=True)
    cliente = ClienteSerializer()
    items = serializers.ListField(child=ItemSerializer(), required=False, default=list)
    total = serializers.IntegerField()
    metodoEntrega = serializers.CharField(max_length=50)
    estado = serializers.ChoiceField(choices=ESTADOS, default="pendiente")
    fecha = serializers.DateField(required=False, allow_null=True)

    @staticmethod
    def to_frontend(pedido) -> dict:
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