const url = "https://www.datos.gov.co/resource/8cnh-7asj.json";
let centros = [];
const selectCodigoFicha = document.getElementById("codigoFicha");
const selectNombrePrograma = document.getElementById("cantidadCentros");
const tablaDocumentos = document.getElementById("tabla-documentos");

async function obtenerCodigoFicha() {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
        centros = await respuesta.json();
        console.log("Centros:", centros);

        const fichasUnicas = new Set(centros.map(codigo => codigo.centro_formacion));
        selectCodigoFicha.innerHTML = '<option value="">Seleccione un centro</option>';
        fichasUnicas.forEach(ficha => {
            const opcion = document.createElement("option");
            opcion.value = ficha;
            opcion.text = ficha;
            selectCodigoFicha.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        if (selectCodigoFicha) {
            selectCodigoFicha.innerHTML = '<option disabled>No se pudieron cargar los códigos.</option>';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerCodigoFicha();

    selectCodigoFicha.addEventListener("change", function () {
        const centroFormacion = selectCodigoFicha.value;
        const tbody = tablaDocumentos.querySelector("tbody") || tablaDocumentos;
        tbody.innerHTML = ''; 

        const fichaSeleccionada = centros.find(codigo => codigo.centro_formacion === centroFormacion);
        if (fichaSeleccionada) {
            localStorage.setItem("codigoReginal", fichaSeleccionada.codigo_centro);
            localStorage.setItem("nombreReginal", fichaSeleccionada.centro_formacion);
            localStorage.setItem("CantidadCentrosReginal", fichaSeleccionada.nombre_regional);
            selectNombrePrograma.innerHTML = `<strong>${centros.length}</strong> centros`;
        } else {
            console.warn("No se encontró la ficha seleccionada:", centroFormacion);
            selectNombrePrograma.value = '';
        }

        centros.forEach(codigo => {
            if (codigo.centro_formacion === centroFormacion) {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${codigo.codigo_centro}</td>
                    <td>${codigo.nombre_municipio}</td>
                    <td>${codigo.centro_formacion}</td>
                    <td>${codigo.latitud}</td>
                    <td>${codigo.longitud}</td>
                `;
                tbody.appendChild(fila);
            }
        });
    });

    const VALID_PASSWORD = '21072025';
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnSalir = document.getElementById('btn-salir');
    const contenedorMostrar = document.getElementById('contenedor-mostrar');
    const contenedorOculto = document.getElementById('contenedor-oculto');

    btnIniciar.addEventListener('click', function () {
        const usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;

        if (contrasena === VALID_PASSWORD) {
            localStorage.setItem('username', usuario);
            contenedorMostrar.id = 'contenedor-oculto';
            contenedorOculto.id = 'contenedor-mostrar';
            document.getElementById('nombre-usuario').innerHTML = `<strong>Usuario:</strong> ${usuario}`;
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });

    btnSalir.addEventListener('click', function () {
        localStorage.clear();
        document.getElementById('usuario').value = "";
        document.getElementById('contrasena').value = "";
        contenedorMostrar.id = 'contenedor-mostrar';
        contenedorOculto.id = 'contenedor-oculto';
    });
});
