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
let codigoValido = false;
/*
|--------------------------------------------------------------------------
| UTILIDADES
|--------------------------------------------------------------------------
*/
function mostrarLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "flex";
    }
}
function ocultarLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }
}

function bloquearBotonGuardar() {
    const boton = document.getElementById("btnGuardar");
    if (boton) {
        boton.disabled = true;
        boton.textContent = "Guardando...";
    }
}
function desbloquearBotonGuardar() {
    const boton = document.getElementById("btnGuardar");
    if (boton) {
        boton.disabled = false;
        boton.textContent = "Guardar";
    }
}
async function fetchJSON(url, options = {}) {
    mostrarLoader();
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        ocultarLoader();
    }
}
/*
|--------------------------------------------------------------------------
| CARGA DE COMBOS
|--------------------------------------------------------------------------
*/
async function cargarBodegas() {
    try {
        const data = await fetchJSON("php/obtener_bodegas.php");
        const select = document.getElementById("bodega");
        select.innerHTML = '<option value="">Seleccione</option>';
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando bodegas:", error);
    }
}

async function cargarMonedas() {
    try {
        const data = await fetchJSON("php/obtener_monedas.php");
        const select = document.getElementById("moneda");
        select.innerHTML = '<option value="">Seleccione</option>';
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando monedas:", error);
    }
}
async function cargarMateriales() {
    try {
        const data = await fetchJSON("php/obtener_materiales.php");
        const container = document.getElementById("materialesContainer");
        container.innerHTML = "";
        data.forEach(item => {
            const label = document.createElement("label");
            label.innerHTML = `
                <input
                    type="checkbox"
                    name="material[]"
                    value="${item.id}">
                ${item.nombre}
            `;
            container.appendChild(label);
        });
    } catch (error) {
        console.error("Error cargando materiales:", error);
    }
}
async function cargarSucursales(idBodega) {
    const select = document.getElementById("sucursal");
    select.innerHTML = '<option value="">Seleccione</option>';
    if (!idBodega) {
        return;
    }
    try {
        const data = await fetchJSON(
            `php/obtener_sucursales.php?id_bodega=${encodeURIComponent(idBodega)}`
        );
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando sucursales:", error);
    }
}
/*
|--------------------------------------------------------------------------
| VALIDAR CODIGO
|--------------------------------------------------------------------------
*/
async function validarCodigoUnico() {
    const codigo = document.getElementById("codigo").value.trim();
    if (!codigo) {
        codigoValido = false;
        return false;
    }
    try {
        const formData = new FormData();
        formData.append("codigo", codigo);
        const data = await fetchJSON(
            "php/validar_codigo.php",
            {
                method: "POST",
                body: formData
            }
        );
        codigoValido = !data.existe;
        if (data.existe) {
            alert("El código del producto ya está registrado.");
            document.getElementById("codigo").focus();
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        codigoValido = false;
        return false;
    }
}
/*
|--------------------------------------------------------------------------
| GUARDAR PRODUCTO
|--------------------------------------------------------------------------
*/
async function guardarProducto() {
    bloquearBotonGuardar();
    try {
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
        if (!codigo) {
            alert("El código del producto no puede estar en blanco.");
            return;
        }
        const regexCodigo = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$/;
        if (!regexCodigo.test(codigo)) {
            alert("El código del producto debe contener letras y números y tener entre 5 y 15 caracteres.");
            return;
        }
        const disponible = await validarCodigoUnico();
        if (!disponible) {
            return;
        }
        if (!nombre) {
            alert("El nombre del producto no puede estar en blanco.");
            return;
        }
        if (nombre.length < 2 || nombre.length > 50) {
            alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
            return;
        }
        if (!bodega) {
            alert("Debe seleccionar una bodega.");
            return;
        }
        if (!sucursal) {
            alert("Debe seleccionar una sucursal.");
            return;
        }
        if (!moneda) {
            alert("Debe seleccionar una moneda.");
            return;
        }
        if (!precio) {
            alert("El precio no puede estar vacío.");
            return;
        }
        const regexPrecio = /^\d+(\.\d{1,2})?$/;
        if (!regexPrecio.test(precio)) {
            alert("El precio debe ser un número válido con hasta dos decimales.");
            return;
        }
        if (materiales.length < 2) {
            alert("Debe seleccionar al menos dos materiales.");
            return;
        }
        if (!descripcion) {
            alert("La descripción no puede estar vacía.");
            return;
        }
        if (descripcion.length < 10 || descripcion.length > 1000) {
            alert("La descripción debe tener entre 10 y 1000 caracteres.");
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
        const data = await fetchJSON(
            "php/guardar_producto.php",
            {
                method: "POST",
                body: formData
            }
        );
        if (data.success) {
            alert("Producto guardado correctamente.");
            document.getElementById("frmProducto").reset();
            document.getElementById("sucursal").innerHTML =
                '<option value="">Seleccione</option>';
            codigoValido = false;
        } else {
            alert(data.message || "No fue posible guardar el producto.");
        }
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al guardar el producto.");
    } finally {
        desbloquearBotonGuardar();
    }
}