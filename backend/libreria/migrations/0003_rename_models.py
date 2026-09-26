"""
Data migration: renombra los modelos ORM de Libro/Pedido a
LibroModel/PedidoModel. Las tablas NO cambian (Meta.db_table mantiene
libreria_libro y libreria_pedido), por lo que los datos, el usuario
y los tokens se preservan intactos.
"""

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("libreria", "0002_seed_libros"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Libro",
            new_name="LibroModel",
        ),
        migrations.RenameModel(
            old_name="Pedido",
            new_name="PedidoModel",
        ),
    ]