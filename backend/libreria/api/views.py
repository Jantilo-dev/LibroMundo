"""
ADAPTADOR PRIMARIO (Driving Adapter) - API REST
---------------------------------------------------
Estas vistas son la "puerta de entrada" HTTP: reciben el request,
lo validan/deserializan con el Serializer, llaman al caso de uso
correspondiente (application/use_cases.py) y devuelven la respuesta
HTTP con el codigo correcto. NO contienen logica de negocio - esa
vive en los casos de uso.

Requieren autenticacion por token:
    Authorization: Token <token>
"""

from dataclasses import asdict

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..application.exceptions import (
    EstadoInvalidoError,
    LibroDuplicadoError,
    LibroNoEncontradoError,
    PedidoNoEncontradoError,
)
from ..application.use_cases import (
    ActualizarLibroUseCase,
    ActualizarPedidoUseCase,
    CrearLibroUseCase,
    CrearPedidoUseCase,
    EliminarLibroUseCase,
    EliminarPedidoUseCase,
    ListarLibrosUseCase,
    ListarPedidosUseCase,
    ObtenerLibroUseCase,
    ObtenerPedidoUseCase,
)
from ..infrastructure.di import get_libro_repository, get_pedido_repository
from .serializers import LibroSerializer, PedidoSerializer


# ------------------------------------------------------------------
# LIBROS
# ------------------------------------------------------------------

class LibroListCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """GET /api/libros/ -> lista todos los libros"""
        repo = get_libro_repository()
        libros = ListarLibrosUseCase(repo).ejecutar()
        data = LibroSerializer([asdict(l) for l in libros], many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        """POST /api/libros/ -> crea un libro nuevo"""
        serializer = LibroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        repo = get_libro_repository()
        try:
            libro = CrearLibroUseCase(repo).ejecutar(serializer.validated_data)
        except LibroDuplicadoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(LibroSerializer(asdict(libro)).data, status=status.HTTP_201_CREATED)


class LibroDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, libro_id):
        """GET /api/libros/<id>/ -> detalle de un libro"""
        repo = get_libro_repository()
        try:
            libro = ObtenerLibroUseCase(repo).ejecutar(libro_id)
        except LibroNoEncontradoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response(LibroSerializer(asdict(libro)).data, status=status.HTTP_200_OK)

    def put(self, request, libro_id):
        """PUT /api/libros/<id>/ -> actualiza un libro"""
        serializer = LibroSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        repo = get_libro_repository()
        try:
            libro = ActualizarLibroUseCase(repo).ejecutar(libro_id, serializer.validated_data)
        except LibroNoEncontradoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)

        return Response(LibroSerializer(asdict(libro)).data, status=status.HTTP_200_OK)

    def delete(self, request, libro_id):
        """DELETE /api/libros/<id>/ -> elimina un libro"""
        repo = get_libro_repository()
        try:
            EliminarLibroUseCase(repo).ejecutar(libro_id)
        except LibroNoEncontradoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


# ------------------------------------------------------------------
# PEDIDOS
# ------------------------------------------------------------------

class PedidoListCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """GET /api/pedidos/ -> lista todos los pedidos"""
        repo = get_pedido_repository()
        pedidos = ListarPedidosUseCase(repo).ejecutar()
        datos = [PedidoSerializer.to_frontend(p) for p in pedidos]
        return Response({"datos": datos}, status=status.HTTP_200_OK)

    def post(self, request):
        """POST /api/pedidos/ -> crea un pedido nuevo"""
        serializer = PedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        repo = get_pedido_repository()
        try:
            pedido = CrearPedidoUseCase(repo).ejecutar(serializer.validated_data)
        except EstadoInvalidoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(PedidoSerializer.to_frontend(pedido), status=status.HTTP_201_CREATED)


class PedidoDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pedido_id):
        """GET /api/pedidos/<id>/ -> detalle de un pedido"""
        repo = get_pedido_repository()
        try:
            pedido = ObtenerPedidoUseCase(repo).ejecutar(pedido_id)
        except PedidoNoEncontradoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response({"datos": PedidoSerializer.to_frontend(pedido)}, status=status.HTTP_200_OK)

    def put(self, request, pedido_id):
        """PUT /api/pedidos/<id>/ -> actualiza un pedido (acepta parcial)"""
        serializer = PedidoSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        repo = get_pedido_repository()
        try:
            pedido = ActualizarPedidoUseCase(repo).ejecutar(pedido_id, serializer.validated_data)
        except PedidoNoEncontradoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except EstadoInvalidoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(PedidoSerializer.to_frontend(pedido), status=status.HTTP_200_OK)

    def delete(self, request, pedido_id):
        """DELETE /api/pedidos/<id>/ -> elimina un pedido"""
        repo = get_pedido_repository()
        try:
            EliminarPedidoUseCase(repo).ejecutar(pedido_id)
        except PedidoNoEncontradoError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)