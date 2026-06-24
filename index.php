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
                <label for="codigo">Código Producto</label>
                <input type="text" id="codigo" name="codigo" maxlength="15">
            </div>
            <div class="form-group">
                <label for="bodega">Bodega</label>
                <select id="bodega" name="bodega">
                    <option value=""></option>
                </select>
            </div>
            <div class="form-group">
                <label for="moneda">Moneda</label>
                <select id="moneda" name="moneda">
                    <option value=""></option>
                </select>
            </div>
        </div>
        <div>
            <div class="form-group">
                <label for="nombre">Nombre Producto</label>
                <input type="text" id="nombre" name="nombre" maxlength="50">
            </div>
            <div class="form-group">
                <label for="sucursal">Sucursal</label>
                <select id="sucursal" name="sucursal">
                    <option value=""></option>
                </select>
            </div>
            <div class="form-group">
                <label for="precio">Precio</label>
                <input type="text" id="precio" name="precio" placeholder="Ej: 19990.50">
            </div>
        </div>
    </div>
    <div class="form-group">
        <label>Material del Producto</label>
        <div id="materialesContainer" class="checkbox-group"></div>
    </div>
    <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion" maxlength="1000"></textarea>
        <small id="contadorDescripcion">
            Restantes: 1000 caracteres
        </small>
    </div>
    <div class="button-container">
        <button type="button" id="btnGuardar">
            Guardar Producto
        </button>
    </div>
</form>
</div>
<div id="loader" class="loader-overlay" style="display:none;">
    <div class="loader"></div>
</div>
<script src="js/app.js"></script>
</body>
</html>