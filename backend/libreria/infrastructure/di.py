"""
Contenedor de inyeccion de dependencias, MUY simple. Es el unico
lugar de todo el proyecto que "decide" que implementacion concreta
del repositorio se usa. Los casos de uso y las vistas API nunca
instancian las implementaciones directamente - piden el repositorio
a estas funciones.
"""

from .repositories import DjangoLibroRepository, DjangoPedidoRepository


def get_libro_repository():
    return DjangoLibroRepository()


def get_pedido_repository():
    return DjangoPedidoRepository()