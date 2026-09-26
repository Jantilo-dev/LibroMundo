"""
Capa api: rutas de la app.

- /api/libros/          : CRUD libros
- /api/pedidos/         : CRUD pedidos
- /api/token/           : obtener token (definido en config/urls.py)
"""

from django.urls import path

from . import views

urlpatterns = [
    path("libros/", views.LibroListCreateView.as_view(), name="libro-list-create"),
    path("libros/<int:libro_id>/", views.LibroDetailView.as_view(), name="libro-detail"),
    path("pedidos/", views.PedidoListCreateView.as_view(), name="pedido-list-create"),
    path("pedidos/<int:pedido_id>/", views.PedidoDetailView.as_view(), name="pedido-detail"),
]