document.addEventListener("DOMContentLoaded", () => {

    cargarBodegas();
    cargarMonedas();

    document.getElementById("bodega").addEventListener("change", function () {
        cargarSucursales(this.value);
    });

    document.getElementById("btnGuardar").addEventListener("click", guardarProducto);

    document.getElementById("codigo").addEventListener("blur", validarCodigoUnico);

});

async function cargarBodegas() {

    const response = await fetch("php/obtener_bodegas.php");
    const data = await response.json();

    const select = document.getElementById("bodega");

    select.innerHTML = '<option value=""></option>';

    data.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nombre}
            </option>
        `;
    });

}

async function cargarMonedas() {

    const response = await fetch("php/obtener_monedas.php");
    const data = await response.json();

    const select = document.getElementById("moneda");

    select.innerHTML = '<option value=""></option>';

    data.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nombre}
            </option>
        `;
    });

}

async function cargarSucursales(idBodega) {

    const select = document.getElementById("sucursal");

    select.innerHTML = '<option value=""></option>';

    if (!idBodega) {
        return;
    }

    const response = await fetch(
        `php/obtener_sucursales.php?id_bodega=${idBodega}`
    );

    const data = await response.json();

    data.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nombre}
            </option>
        `;
    });

}

async function validarCodigoUnico() {

    const codigo = document.getElementById("codigo").value.trim();

    if (codigo === "") {
        return false;
    }

    const formData = new FormData();
    formData.append("codigo", codigo);

    const response = await fetch(
        "php/validar_codigo.php",
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (data.existe) {

        alert("El código del producto ya está registrado.");

        document.getElementById("codigo").focus();

        return false;
    }

    return true;
}

async function guardarProducto() {

    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const bodega = document.getElementById("bodega").value;
    const sucursal = document.getElementById("sucursal").value;
    const moneda = document.getElementById("moneda").value;
    const precio = document.getElementById("precio").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    const materiales = document.querySelectorAll(
        'input[name="material[]"]:checked'
    );

    // Código

    if (codigo === "") {
        alert("El código del producto no puede estar en blanco.");
        return;
    }

    const regexCodigo = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$/;

    if (!regexCodigo.test(codigo)) {
        alert("El código del producto debe contener letras y números");
        return;
    }

    if (codigo.length < 5 || codigo.length > 15) {
        alert("El código del producto debe tener entre 5 y 15 caracteres.");
        return;
    }

    const codigoDisponible = await validarCodigoUnico();

    if (!codigoDisponible) {
        return;
    }

    // Nombre

    if (nombre === "") {
        alert("El nombre del producto no puede estar en blanco.");
        return;
    }

    if (nombre.length < 2 || nombre.length > 50) {
        alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
        return;
    }

    // Bodega

    if (bodega === "") {
        alert("Debe seleccionar una bodega.");
        return;
    }

    // Sucursal

    if (sucursal === "") {
        alert("Debe seleccionar una sucursal para la bodega seleccionada.");
        return;
    }

    // Moneda

    if (moneda === "") {
        alert("Debe seleccionar una moneda para el producto.");
        return;
    }

    // Precio

    if (precio === "") {
        alert("El precio del producto no puede estar en blanco.");
        return;
    }

    const regexPrecio = /^\d+(\.\d{1,2})?$/;

    if (!regexPrecio.test(precio)) {
        alert("El precio del producto debe ser un número positivo con hasta dos decimales.");
        return;
    }

    // Materiales

    if (materiales.length < 2) {
        alert("Debe seleccionar al menos dos materiales para el producto.");
        return;
    }

    // Descripción

    if (descripcion === "") {
        alert("La descripción del producto no puede estar en blanco.");
        return;
    }

    if (descripcion.length < 10 || descripcion.length > 1000) {
        alert("La descripción del producto debe tener entre 10 y 1000 caracteres.");
        return;
    }

    const formData = new FormData();

    formData.append("codigo", codigo);
    formData.append("nombre", nombre);
    formData.append("bodega", bodega);
    formData.append("sucursal", sucursal);
    formData.append("moneda", moneda);
    formData.append("precio", precio);
    formData.append("descripcion", descripcion);

    materiales.forEach(material => {
        formData.append("materiales[]", material.value);
    });

    try {

        const response = await fetch(
            "php/guardar_producto.php",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Producto guardado correctamente.");

            document.getElementById("frmProducto").reset();

            document.getElementById("sucursal").innerHTML =
                '<option value=""></option>';

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.error(error);

        alert("Error al guardar el producto.");
    }
}