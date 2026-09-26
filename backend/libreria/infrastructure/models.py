"""
Capa de infraestructura: modelos ORM de Django.

Solo definen la persistencia de datos. NO contienen reglas de negocio.
"""

from django.db import models


class Libro(models.Model):
    """Tabla del catalogo (entidad principal)."""

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    price = models.IntegerField()
    category = models.CharField(max_length=50)
    format = models.CharField(max_length=10)
    image = models.URLField()
    description = models.TextField()
    year = models.IntegerField()
    pages = models.IntegerField()
    video = models.CharField(max_length=64, blank=True, default="")

    def __str__(self):
        return self.title


class Pedido(models.Model):
    """Tabla de pedidos (entidad secundaria).

    Se relaciona con Libro mediante ForeignKey y guarda el detalle
    de varios libros en ``items`` (JSONField), aplanando el subdocumento
    ``cliente`` en columnas directas.
    """

    ESTADOS = [
        ("pendiente", "Pendiente"),
        ("confirmado", "Confirmado"),
        ("enviado", "Enviado"),
        ("completado", "Completado"),
        ("cancelado", "Cancelado"),
    ]

    libro = models.ForeignKey(
        Libro,
        on_delete=models.CASCADE,
        related_name="pedidos",
        null=True,
        blank=True,
    )
    cliente_nombre = models.CharField(max_length=200)
    cliente_email = models.EmailField()
    cliente_direccion = models.CharField(max_length=300)
    items = models.JSONField(default=list)
    total = models.IntegerField()
    metodo_entrega = models.CharField(max_length=50, default="despacho a domicilio")
    estado = models.CharField(
        max_length=20, choices=ESTADOS, default="pendiente"
    )
    fecha = models.DateField()

    def __str__(self):
        return f"Pedido {self.pk or '-'} - {self.cliente_nombre}"