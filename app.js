const usuarioValido = "sofia alzate";
const claveValida = "21072025";
const urlAPI = "https://www.datos.gov.co/resource/8cnh-7asj.json";
let centros = [];

function iniciarSesion() {
  const user = document.getElementById("usuario").value.toLowerCase().trim();
  const pass = document.getElementById("contrasena").value.trim();

  if (user === usuarioValido && pass === claveValida) {
    localStorage.setItem("usuario", user);
    mostrarApp();
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

function cerrarSesion() {
  localStorage.clear();
  document.getElementById("app").classList.add("oculto");
  document.getElementById("login").classList.remove("oculto");
}

function mostrarApp() {
  document.getElementById("nombreUsuario").textContent = localStorage.getItem("usuario");
  document.getElementById("login").classList.add("oculto");
  document.getElementById("app").classList.remove("oculto");
}

function cargarDatos() {
  fetch(urlAPI)
    .then(res => res.json())
    .then(data => {
      console.log(data[0]); // 👈🏼 Esto imprime la estructura de un centro en la consola
      centros = data;
      llenarSelectRegional(data);
      if (localStorage.getItem("regional")) {
        document.getElementById("selectRegional").value = localStorage.getItem("regional");
        filtrarPorRegional();
      }
    });
}

function llenarSelectRegional(data) {
  const regionesUnicas = [...new Set(data.map(c => c.nombre_regional))];
  const select = document.getElementById("selectRegional");
  regionesUnicas.sort().forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    select.appendChild(option);
  });
}

function filtrarPorRegional() {
  const seleccion = document.getElementById("selectRegional").value;
  const filtrados = centros.filter(c => c.nombre_regional === seleccion);
  document.getElementById("cantidad").textContent = filtrados.length;

  if (filtrados.length > 0) {
    localStorage.setItem("regional", seleccion);
    localStorage.setItem("codigo_regional", filtrados[0].codigo_regional);
    localStorage.setItem("cantidad_centros", filtrados.length);
  }

  const tbody = document.getElementById("tablaCentros");
  tbody.innerHTML = "";

  filtrados.forEach(c => {
    const cod = c.codigo_centro || "—";
    const muni = c.municipio || c.municipio_centro || "—"; // aquí puedes cambiar según lo que diga console
    const nom = c.nombre_centro || c.nombre_centro_formacion || c.nombre_centro_de_formacion || "—";
    const lat = parseFloat(c.latitud);
    const lon = parseFloat(c.longitud);

    const celdaLat = `<td class="${lat < 0 ? 'negativo' : ''}">${isNaN(lat) ? "—" : lat}</td>`;
    const celdaLon = `<td class="${lon < 0 ? 'negativo' : ''}">${isNaN(lon) ? "—" : lon}</td>`;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cod}</td>
      <td>${muni}</td>
      <td>${nom}</td>
      ${celdaLat}
      ${celdaLon}
    `;

    tbody.appendChild(fila);
  });
}

window.onload = () => {
  if (localStorage.getItem("usuario") === usuarioValido) {
    mostrarApp();
  }

  cargarDatos();
};
