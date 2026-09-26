"""
Data migration: fija los nombres de tabla a libreria_libro y
libreria_pedido (los datos se conservan; la tabla se renombra).
"""

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("libreria", "0003_rename_models"),
    ]

    operations = [
        migrations.AlterModelTable(
            name="LibroModel",
            table="libreria_libro",
        ),
        migrations.AlterModelTable(
            name="PedidoModel",
            table="libreria_pedido",
        ),
    ]