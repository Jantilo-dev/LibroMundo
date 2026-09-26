"""
Data migration: siembra los 6 libros del catalogo que usaba el frontend
(booksData.js) en la tabla Libro de la base relacional.
"""

from django.db import migrations

LIBROS = [
    {
        "title": "Cien Años de Soledad",
        "author": "Gabriel García Márquez",
        "price": 19990,
        "category": "novela",
        "format": "fisico",
        "image": "https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg",
        "description": "Una de las obras más importantes de la literatura universal...",
        "year": 1967,
        "pages": 496,
        "video": "a5evsIcpsLQ",
    },
    {
        "title": "El Principito",
        "author": "Antoine de Saint-Exupéry",
        "price": 12990,
        "category": "infantil",
        "format": "ebook",
        "image": "https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg",
        "description": "Un clásico que narra las aventuras de un pequeño príncipe que viaja por el universo...",
        "year": 1943,
        "pages": 96,
        "video": "a03jNKdbIWg",
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "price": 15990,
        "category": "ciencia-ficcion",
        "format": "fisico",
        "image": "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
        "description": "Una distopía donde el Gran Hermano vigila todos los movimientos de los ciudadanos.",
        "year": 1949,
        "pages": 328,
        "video": "qLraA3KjY68",
    },
    {
        "title": "Don Quijote de la Mancha",
        "author": "Miguel de Cervantes",
        "price": 24990,
        "category": "clasico",
        "format": "fisico",
        "image": "https://covers.openlibrary.org/b/isbn/9780060934347-M.jpg",
        "description": "La obra más importante de la literatura española, con las aventuras del ingenioso hidalgo.",
        "year": 1605,
        "pages": 896,
        "video": "j4nNNjlYlOo",
    },
    {
        "title": "El Alquimista",
        "author": "Paulo Coelho",
        "price": 14990,
        "category": "ficcion",
        "format": "ebook",
        "image": "https://covers.openlibrary.org/b/isbn/9780062502179-M.jpg",
        "description": "Un joven pastor viaja desde España hasta Egipto en busca de un tesoro y el sentido de la vida.",
        "year": 1988,
        "pages": 208,
        "video": "1c6GgZwsxlc",
    },
    {
        "title": "La Casa de los Espíritus",
        "author": "Isabel Allende",
        "price": 18990,
        "category": "novela",
        "format": "fisico",
        "image": "https://covers.openlibrary.org/b/isbn/9780553383805-M.jpg",
        "description": "Saga familiar que mezcla realismo mágico y crítica social a través de varias generaciones.",
        "year": 1982,
        "pages": 480,
        "video": "er-6ZICeHfk",
    },
]


def seed_libros(apps, schema_editor):
    Libro = apps.get_model("libreria", "Libro")
    for data in LIBROS:
        Libro.objects.get_or_create(**data)


def unseed_libros(apps, schema_editor):
    Libro = apps.get_model("libreria", "Libro")
    Libro.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("libreria", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_libros, unseed_libros),
    ]