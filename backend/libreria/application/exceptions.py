"""
Excepciones propias del dominio/aplicacion, sin depender de Django
ni de DRF. La capa API (adaptador) las traduce a codigos HTTP
(400, 404, etc.), pero aca no se sabe que existe HTTP.
"""


class LibroNoEncontradoError(Exception):
    pass


class PedidoNoEncontradoError(Exception):
    pass


class LibroDuplicadoError(Exception):
    pass


class EstadoInvalidoError(Exception):
    pass