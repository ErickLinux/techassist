const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

const nombreUsuario = document.getElementById("nombreUsuario");
const nombreTecnico = document.getElementById("nombreTecnico");

const diaServicio = document.getElementById("diaServicio");
const fechaServicio = document.getElementById("fechaServicio");

const horaIngreso = document.getElementById("horaIngreso");
const horaEgreso = document.getElementById("horaEgreso");
const totalAtencion = document.getElementById("totalAtencion");

const inicioViaje = document.getElementById("inicioViaje");
const finViaje = document.getElementById("finViaje");
const totalViaje = document.getElementById("totalViaje");

const trabajoRealizado = document.getElementById("trabajoRealizado");
const contadorCaracteres = document.getElementById("contadorCaracteres");

const codigoTienda = document.getElementById("codigoTienda");
const btnBuscarTienda = document.getElementById("btnBuscarTienda");
const mensajeTienda = document.getElementById("mensajeTienda");

const formServicio = document.getElementById("formServicio");
const btnLimpiar = document.getElementById("btnLimpiar");

const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const btnMenu = document.getElementById("btnMenu");
const sidebar = document.getElementById("sidebar");

let totalMinutosAtencion = 0;
let totalMinutosViaje = 0;

/**
 * Verifica que exista una sesión activa.
 */
function verificarSesion() {
  if (!token || !usuarioGuardado) {
    window.location.href = "./login.html";
    return;
  }

  try {
    const usuario = JSON.parse(usuarioGuardado);

    nombreUsuario.textContent = usuario.nombre;
    nombreTecnico.value = usuario.nombre;
  } catch (error) {
    console.error("Error al leer el usuario:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "./login.html";
  }
}

/**
 * Coloca automáticamente la fecha y el día actual.
 */
function cargarFechaActual() {
  const fechaActual = new Date();

  const anio = fechaActual.getFullYear();
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaActual.getDate()).padStart(2, "0");

  fechaServicio.value = `${anio}-${mes}-${dia}`;

  diaServicio.value = fechaActual.toLocaleDateString("es-GT", {
    weekday: "long"
  });

  diaServicio.value =
    diaServicio.value.charAt(0).toUpperCase() +
    diaServicio.value.slice(1);
}

/**
 * Convierte una hora HH:mm a minutos.
 */
function convertirHoraAMinutos(hora) {
  if (!hora) {
    return null;
  }

  const [horas, minutos] = hora.split(":").map(Number);

  return horas * 60 + minutos;
}

/**
 * Calcula la diferencia entre dos horas.
 * También permite horarios que terminan después de medianoche.
 */
function calcularDiferenciaMinutos(inicio, fin) {
  const minutosInicio = convertirHoraAMinutos(inicio);
  let minutosFin = convertirHoraAMinutos(fin);

  if (minutosInicio === null || minutosFin === null) {
    return 0;
  }

  if (minutosFin < minutosInicio) {
    minutosFin += 24 * 60;
  }

  return minutosFin - minutosInicio;
}

/**
 * Convierte minutos a un texto legible.
 */
function formatearMinutos(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${horas} h ${minutos} min`;
}

function calcularTiempoAtencion() {
  totalMinutosAtencion = calcularDiferenciaMinutos(
    horaIngreso.value,
    horaEgreso.value
  );

  totalAtencion.value = formatearMinutos(totalMinutosAtencion);
}

function calcularTiempoViaje() {
  totalMinutosViaje = calcularDiferenciaMinutos(
    inicioViaje.value,
    finViaje.value
  );

  totalViaje.value = formatearMinutos(totalMinutosViaje);
}

function actualizarContador() {
  contadorCaracteres.textContent = trabajoRealizado.value.length;
}

function mostrarMensajeTienda(mensaje, tipo) {
  mensajeTienda.textContent = mensaje;
  mensajeTienda.className = `alert alert-${tipo} mt-3`;
}

/**
 * Esta función será conectada posteriormente con el backend.
 */
function buscarTienda() {
  const codigo = codigoTienda.value.trim();

  if (!codigo) {
    mostrarMensajeTienda(
      "Ingresa el código identificador de la tienda.",
      "warning"
    );

    return;
  }

  mostrarMensajeTienda(
    "La búsqueda de tienda se conectará al backend en el siguiente paso.",
    "info"
  );
}

horaIngreso.addEventListener("change", calcularTiempoAtencion);
horaEgreso.addEventListener("change", calcularTiempoAtencion);

inicioViaje.addEventListener("change", calcularTiempoViaje);
finViaje.addEventListener("change", calcularTiempoViaje);

trabajoRealizado.addEventListener("input", actualizarContador);

btnBuscarTienda.addEventListener("click", buscarTienda);

codigoTienda.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    buscarTienda();
  }
});

formServicio.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!formServicio.checkValidity()) {
    formServicio.classList.add("was-validated");
    return;
  }

  if (!document.getElementById("nombreTienda").value) {
    mostrarMensajeTienda(
      "Debes buscar y seleccionar una tienda válida antes de guardar.",
      "danger"
    );

    codigoTienda.focus();
    return;
  }

  const datosServicio = {
    codigoTienda: Number(codigoTienda.value),
    numeroTicket: document.getElementById("numeroTicket").value.trim(),
    numeroCaf: document.getElementById("numeroCaf").value.trim() || null,
    horaIngreso: horaIngreso.value,
    horaEgreso: horaEgreso.value,
    totalMinutosAtencion,
    totalKilometros: Number(
      document.getElementById("totalKilometros").value
    ),
    inicioViaje: inicioViaje.value || null,
    finViaje: finViaje.value || null,
    totalMinutosViaje,
    trabajoRealizado: trabajoRealizado.value.trim()
  };

  console.log("Datos preparados para guardar:", datosServicio);

  alert(
    "El formulario funciona correctamente. En el siguiente paso lo conectaremos con el backend."
  );
});

btnLimpiar.addEventListener("click", () => {
  setTimeout(() => {
    cargarFechaActual();

    totalMinutosAtencion = 0;
    totalMinutosViaje = 0;

    totalAtencion.value = "0 h 0 min";
    totalViaje.value = "0 h 0 min";

    contadorCaracteres.textContent = "0";

    mensajeTienda.className = "alert mt-3 d-none";
    mensajeTienda.textContent = "";

    formServicio.classList.remove("was-validated");

    verificarSesion();
  }, 0);
});

btnCerrarSesion.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "./login.html";
});

btnMenu.addEventListener("click", () => {
  sidebar.classList.toggle("visible");
});

verificarSesion();
cargarFechaActual();