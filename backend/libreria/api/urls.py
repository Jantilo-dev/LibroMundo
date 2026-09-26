"""
Capa api: rutas de la app.

- /api/auth/token/  : obtener token (username/password)
- /api/libros/      : CRUD libros
- /api/pedidos/     : CRUD pedidos
"""

from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from .views import LibroViewSet, PedidoViewSet

router = DefaultRouter()
router.register("libros", LibroViewSet, basename="libros")
router.register("pedidos", PedidoViewSet, basename="pedidos")

urlpatterns = [
    path("auth/token/", obtain_auth_token, name="auth-token"),
    path("", include(router.urls)),
]