from django.contrib import admin

from .infrastructure.models import LibroModel, PedidoModel


@admin.register(LibroModel)
class LibroAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "price", "category", "format")
    search_fields = ("title", "author")


@admin.register(PedidoModel)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ("id", "cliente_nombre", "cliente_email", "total", "estado", "fecha")
    list_filter = ("estado", "metodo_entrega")
    search_fields = ("cliente_nombre", "cliente_email")