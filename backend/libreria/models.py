"""
Re-exporta los modelos hacia el cargador de modelos de Django.

La definicion real vive en infrastructure/models.py (capa de infraestructura).
"""

from .infrastructure.models import LibroModel, PedidoModel

__all__ = ["LibroModel", "PedidoModel"]