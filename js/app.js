document.addEventListener("DOMContentLoaded", () => {


cargarBodegas();
cargarMonedas();
cargarMateriales();

document.getElementById("bodega").addEventListener("change", function () {
    cargarSucursales(this.value);
});

document.getElementById("btnGuardar").addEventListener("click", guardarProducto);

document.getElementById("codigo").addEventListener("blur", validarCodigoUnico);


});

async function cargarBodegas() {


try {

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

} catch (error) {

    console.error(error);

}


}

async function cargarMonedas() {


try {

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

} catch (error) {

    console.error(error);

}


}

async function cargarMateriales() {


try {

    const response = await fetch("php/obtener_materiales.php");
    const data = await response.json();

    let html = "";

    data.forEach(item => {

        html += `
            <label>
                <input
                    type="checkbox"
                    name="material[]"
                    value="${item.id}">
                ${item.nombre}
            </label>
        `;

    });

    document.getElementById("materialesContainer").innerHTML = html;

} catch (error) {

    console.error(error);

}


}

async function cargarSucursales(idBodega) {


const select = document.getElementById("sucursal");

select.innerHTML = '<option value=""></option>';

if (!idBodega) {
    return;
}

try {

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

} catch (error) {

    console.error(error);

}


}

async function validarCodigoUnico() {


const codigo = document.getElementById("codigo").value.trim();

if (codigo === "") {
    return false;
}

try {

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

} catch (error) {

    console.error(error);

    return false;

}


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

if (nombre === "") {
    alert("El nombre del producto no puede estar en blanco.");
    return;
}

if (nombre.length < 2 || nombre.length > 50) {
    alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
    return;
}

if (bodega === "") {
    alert("Debe seleccionar una bodega.");
    return;
}

if (sucursal === "") {
    alert("Debe seleccionar una sucursal para la bodega seleccionada.");
    return;
}

if (moneda === "") {
    alert("Debe seleccionar una moneda para el producto.");
    return;
}

if (precio === "") {
    alert("El precio del producto no puede estar en blanco.");
    return;
}

const regexPrecio = /^\d+(\.\d{1,2})?$/;

if (!regexPrecio.test(precio)) {
    alert("El precio del producto debe ser un número positivo con hasta dos decimales.");
    return;
}

if (materiales.length < 2) {
    alert("Debe seleccionar al menos dos materiales para el producto.");
    return;
}

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

        alert(data.message || "No fue posible guardar el producto.");

    }

} catch (error) {

    console.error(error);

    alert("Error al guardar el producto.");

}


}
