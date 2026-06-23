<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Productos</title>

    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="container">

    <h2>Formulario de Registro de Productos</h2>

    <form id="frmProducto">

    <div class="form-row">

        <div>

            <div class="form-group">
                <label>Código Producto</label>
                <input type="text" id="codigo" name="codigo">
            </div>

            <div class="form-group">
                <label>Bodega</label>
                <select id="bodega" name="bodega">
                    <option value=""></option>
                </select>
            </div>

            <div class="form-group">
                <label>Moneda</label>
                <select id="moneda" name="moneda">
                    <option value=""></option>
                </select>
            </div>

        </div>

        <div>

            <div class="form-group">
                <label>Nombre Producto</label>
                <input type="text" id="nombre" name="nombre">
            </div>

            <div class="form-group">
                <label>Sucursal</label>
                <select id="sucursal" name="sucursal">
                    <option value=""></option>
                </select>
            </div>

            <div class="form-group">
                <label>Precio</label>
                <input type="text" id="precio" name="precio">
            </div>

        </div>

    </div>

    <div class="form-group">
        <label>Material del Producto</label>

        <div id="materialesContainer" class="checkbox-group"></div>
    </div>

    <div class="form-group">
        <label>Descripción</label>
        <textarea id="descripcion" name="descripcion"></textarea>
    </div>

    <div class="button-container">
        <button type="button" id="btnGuardar">
            Guardar Producto
        </button>
    </div>

</form>

</div>

<script src="js/app.js"></script>

</body>
</html>