let servicios = [];
let servicioSeleccionado = null;
let diasEspeciales = [];



// ==============================
// SESIÓN
// ==============================

const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");


// ==============================
// ELEMENTOS
// ==============================
const menuAdministrarUsuarios =
  document.getElementById(
    "menuAdministrarUsuarios"
  );
const nombreUsuario =
  document.getElementById(
    "nombreUsuario"
  );

const btnCerrarSesion =
  document.getElementById(
    "btnCerrarSesion"
  );

const btnMenu =
  document.getElementById(
    "btnMenu"
  );

const sidebar =
  document.getElementById(
    "sidebar"
  );

const filtroMes =
  document.getElementById(
    "filtroMes"
  );

const filtroAnio =
  document.getElementById(
    "filtroAnio"
  );

const btnMesActual =
  document.getElementById(
    "btnMesActual"
  );

const btnLimpiarFiltro =
  document.getElementById(
    "btnLimpiarFiltro"
  );

const cargandoServicios =
  document.getElementById(
    "cargandoServicios"
  );

const sinServicios =
  document.getElementById(
    "sinServicios"
  );

const tablaServiciosContenedor =
  document.getElementById(
    "tablaServiciosContenedor"
  );

const tablaServicios =
  document.getElementById(
    "tablaServicios"
  );

const seccionServicioSeleccionado =
  document.getElementById(
    "seccionServicioSeleccionado"
  );

const detalleServicio =
  document.getElementById(
    "detalleServicio"
  );

const badgeTicket =
  document.getElementById(
    "badgeTicket"
  );

const btnGenerarScript =
  document.getElementById(
    "btnGenerarScript"
  );

const btnCancelarSeleccion =
  document.getElementById(
    "btnCancelarSeleccion"
  );

const seccionScript =
  document.getElementById(
    "seccionScript"
  );

const textoScript =
  document.getElementById(
    "textoScript"
  );

const btnCopiarScript =
  document.getElementById(
    "btnCopiarScript"
  );
const btnWhatsApp =
  document.getElementById(
    "btnWhatsApp"
  );

  const totalExtraAtencion =
  document.getElementById(
    "totalExtraAtencion"
  );

const totalExtraViaje =
  document.getElementById(
    "totalExtraViaje"
  );

const totalHorasExtra =
  document.getElementById(
    "totalHorasExtra"
  );

const mostrarTodosServicios =
  document.getElementById("mostrarTodosServicios");
  function filtrarServiciosPorMes() {

  const mes =
    Number(filtroMes.value);

  const anio =
    Number(filtroAnio.value);


  const filtrados =
    servicios.filter(
      (servicio) => {

        const fecha =
          new Date(servicio.fecha);

        return (
          fecha.getMonth() === mes &&
          fecha.getFullYear() === anio
        );
      }
    );


  mostrarServicios(filtrados);
}
const btnMesAnterior =
  document.getElementById(
    "btnMesAnterior"
  );

const btnMesSiguiente =
  document.getElementById(
    "btnMesSiguiente"
  );
  function cambiarMes(desplazamiento) {

  let mes =
    Number(filtroMes.value);

  let anio =
    Number(filtroAnio.value);

  mes += desplazamiento;

  if (mes < 0) {
    mes = 11;
    anio--;
  }

  if (mes > 11) {
    mes = 0;
    anio++;
  }

  filtroMes.value = mes;
  filtroAnio.value = anio;

  filtrarServiciosPorMes();
}

btnMesAnterior.addEventListener(
  "click",
  () => {

    cambiarMes(-1);
  }
);


btnMesSiguiente.addEventListener(
  "click",
  () => {

    cambiarMes(1);
  }
);


  function calcularResumenHorasExtras(lista) {

  let minutosAtencion = 0;
let minutosViaje = 0;
let minutosRegresoCasa = 0;

  lista.forEach((servicio) => {

    const resultado =
      calcularHorasExtrasServicio(
        servicio
      );

    minutosAtencion +=
      resultado.minutosExtraAtencion;

    minutosViaje +=
      resultado.minutosExtraViaje;
      minutosRegresoCasa +=
  resultado.minutosExtraRegresoCasa;
  });


  const total =
  minutosAtencion +
  minutosViaje +
  minutosRegresoCasa;


  totalExtraAtencion.textContent =
    convertirMinutos(
      minutosAtencion
    );


  totalExtraViaje.textContent =
    convertirMinutos(
      minutosViaje
    );


  totalHorasExtra.textContent =
    convertirMinutos(
      total
    );
}

// ==============================
// VALIDAR SESIÓN
// ==============================

if (!token || !usuarioGuardado) {

  window.location.href =
    "./login.html";

} else {

  try {

    const usuario =
      JSON.parse(usuarioGuardado);
      if (usuario.rol === "ADMIN") {

  document.getElementById("menuAdministrarUsuarios")
    ?.classList.remove("d-none");

  document.getElementById("menuAdministrarRepuestos")
    ?.classList.remove("d-none");

  document.getElementById("menuAdministrarDiasEspeciales")
    ?.classList.remove("d-none");

}

    nombreUsuario.textContent =
      usuario.nombre;

  } catch (error) {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );

    window.location.href =
      "./login.html";
  }
}


// ==============================
// CERRAR SESIÓN
// ==============================

btnCerrarSesion.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );

    window.location.href =
      "./login.html";
  }
);


// ==============================
// MENÚ
// ==============================

btnMenu.addEventListener(
  "click",
  () => {

    sidebar.classList.toggle(
      "visible"
    );
  }
);


// ==============================
// FUNCIONES DE FORMATO
// ==============================

function convertirMinutos(minutos) {

  const total =
    Number(minutos) || 0;

  const horas =
    Math.floor(total / 60);

  const minutosRestantes =
    total % 60;

  return `${horas} h ${minutosRestantes} min`;
}


function formatearFecha(fecha) {

  const valor =
    new Date(fecha);

  return valor.toLocaleDateString(
    "es-GT",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );
}


function obtenerFechaInput(fecha) {

  const valor =
    new Date(fecha);

  const anio =
    valor.getFullYear();

  const mes =
    String(
      valor.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const dia =
    String(
      valor.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${anio}-${mes}-${dia}`;
}


function formatearHora(fechaHora) {

  if (!fechaHora) {
    return "No registrado";
  }

  const fecha = new Date(fechaHora);

  return fecha.toLocaleTimeString(
    "es-GT",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Guatemala"
    }
  );
}
function formatearHora24(fechaHora) {

  if (!fechaHora) {
    return "0";
  }

  const fecha = new Date(fechaHora);

  return fecha.toLocaleTimeString(
    "es-GT",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Guatemala"
    }
  );
}


function convertirMinutosFormato(minutos) {

  const total = Number(minutos) || 0;

  if (total === 0) {
    return "0";
  }

  const horas =
    Math.floor(total / 60);

  const minutosRestantes =
    total % 60;

  return `${horas}:${String(
    minutosRestantes
  ).padStart(2, "0")}HR`;
}

// ==============================
// CÁLCULO DE HORAS EXTRAS
// ==============================

// Las fechas DATE de PostgreSQL se reciben en UTC. Tomamos la parte
// AAAA-MM-DD para evitar desplazarlas un día por la zona horaria.
function fechaISOCalendario(valor) {
  if (!valor) return "";
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
    return valor.slice(0, 10);
  }
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guatemala", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(fecha);
}

function esDiaEspecial(fecha) {
  const iso = fechaISOCalendario(fecha);
  if (!iso) return false;
  return diasEspeciales.some(dia => {
    if (!dia.activo) return false;
    const registrada = fechaISOCalendario(dia.fecha);
    return registrada === iso ||
      (dia.recurrente && registrada.slice(5) === iso.slice(5));
  });
}

function esDiaExtraCompleto(fecha) {
  const iso = fechaISOCalendario(fecha);
  if (!iso) return false;
  const diaSemana = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return diaSemana === 0 || diaSemana === 6 || esDiaEspecial(iso);
}

// Cada tramo se evalúa en horario de Guatemala, incluso si cruza medianoche.
function calcularMinutosExtra(fechaInicio, fechaFin, fechaServicio) {
  if (!fechaInicio || !fechaFin || !fechaServicio) return 0;
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime()) || fin <= inicio) return 0;

  let extra = 0;
  let cursor = inicio.getTime();
  const limite = fin.getTime();
  const zona = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guatemala", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });

  // Guatemala utiliza UTC-06:00 sin cambio estacional.
  while (cursor < limite) {
    const partes = Object.fromEntries(zona.formatToParts(new Date(cursor))
      .filter(p => p.type !== "literal").map(p => [p.type, p.value]));
    const iso = `${partes.year}-${partes.month}-${partes.day}`;
    const medianocheSiguiente = Date.parse(`${iso}T06:00:00Z`) + 86400000;
    const finTramo = Math.min(limite, medianocheSiguiente);
    if (esDiaExtraCompleto(iso)) {
      extra += (finTramo - cursor) / 60000;
    } else {
      const inicioNormal = Date.parse(`${iso}T14:00:00Z`); // 08:00 GT
      const finNormal = Date.parse(`${iso}T00:00:00Z`) + 86400000; // 18:00 GT
      const normales = Math.max(0, Math.min(finTramo, finNormal) - Math.max(cursor, inicioNormal)) / 60000;
      extra += (finTramo - cursor) / 60000 - normales;
    }
    cursor = finTramo;
  }
  return Math.max(0, Math.round(extra));
}

async function cargarDiasEspeciales() {
  const respuesta = await fetch(`${API_URL}/api/dias-especiales`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (respuesta.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "./login.html";
    throw new Error("La sesión expiró.");
  }
  if (!respuesta.ok) {
    throw new Error(`No se pudieron consultar los días especiales (HTTP ${respuesta.status}).`);
  }
  const datos = await respuesta.json();
  if (!Array.isArray(datos.diasEspeciales)) {
    throw new Error("La respuesta de días especiales no tiene el formato esperado.");
  }
  diasEspeciales = datos.diasEspeciales;
}


function calcularHorasExtrasServicio(
  servicio
) {

  const minutosExtraAtencion =
    calcularMinutosExtra(
      servicio.horaIngreso,
      servicio.horaEgreso,
      servicio.fecha
    );

  const minutosExtraViaje =
    calcularMinutosExtra(
      servicio.inicioViaje,
      servicio.finViaje,
      servicio.fecha
    );

  const minutosExtraRegresoCasa =
    calcularMinutosExtra(
      servicio.inicioRegresoCasa,
      servicio.finRegresoCasa,
      servicio.fecha
    );

  const totalMinutosExtra =
    minutosExtraAtencion +
    minutosExtraViaje +
    minutosExtraRegresoCasa;

  return {
    minutosExtraAtencion,
    minutosExtraViaje,
    minutosExtraRegresoCasa,
    totalMinutosExtra
  };
}


// ==============================
// CARGAR SERVICIOS
// ==============================

async function cargarServicios() {

  cargandoServicios.classList.remove(
    "d-none"
  );

  sinServicios.classList.add(
    "d-none"
  );

  tablaServiciosContenedor.classList.add(
    "d-none"
  );


  try {

    const respuesta =
  await fetch(
    `${API_URL}/api/servicios/mis-servicios`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );


    if (
      respuesta.status === 401 ||
      respuesta.status === 403
    ) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "usuario"
      );

      window.location.href =
        "./login.html";

      return;
    }


    const datos =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.mensaje ||
        "No fue posible consultar los servicios"
      );
    }


    servicios =
  datos.servicios || [];

filtrarServiciosPorMes();;


  } catch (error) {

    console.error(
      "Error cargando servicios:",
      error
    );

    cargandoServicios.classList.add(
      "d-none"
    );

    sinServicios.classList.remove(
      "d-none"
    );

    sinServicios.innerHTML = `
      <div class="alert alert-danger">
        ${error.message}
      </div>
    `;
  }
}


// ==============================
// MOSTRAR SERVICIOS
// ==============================

function escaparHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[caracter]);
}

const tarjetasServiciosMovil = document.getElementById("tarjetasServiciosMovil");

function mostrarServicios(lista) {
  // El resumen siempre representa todas las extras del período.
  calcularResumenHorasExtras(lista);

  const listaVisible = mostrarTodosServicios?.checked
    ? lista
    : lista.filter(servicio =>
        calcularHorasExtrasServicio(servicio).totalMinutosExtra > 0
      );

  cargandoServicios.classList.add(
    "d-none"
  );

  tablaServicios.innerHTML = "";
  tarjetasServiciosMovil.innerHTML = "";
  tarjetasServiciosMovil.classList.add("d-none");


  if (!listaVisible.length) {

    sinServicios.innerHTML = `<i class="bi bi-inbox fs-1 text-secondary"></i>
      <p class="mt-2">${lista.length
        ? "No hay servicios con horas extras en este período."
        : "No hay servicios para mostrar en este período."}</p>`;

    tablaServiciosContenedor.classList.add(
      "d-none"
    );

    sinServicios.classList.remove(
      "d-none"
    );

    return;
  }


  sinServicios.classList.add(
    "d-none"
  );


  listaVisible.forEach(
    (servicio) => {

      const fila =
        document.createElement(
          "tr"
        );


      fila.innerHTML = `
        <td>
          ${formatearFecha(
            servicio.fecha
          )}
        </td>

        <td>
          <strong>
            ${servicio.numeroTicket}
          </strong>
        </td>

        <td>

          <div>
            ${servicio.tienda.nombre}
          </div>

          <small class="text-secondary">
            ${servicio.tienda.departamento}
            -
            ${servicio.tienda.municipio}
          </small>

        </td>

        <td>
          ${convertirMinutos(
            servicio.totalMinutosAtencion
          )}
        </td>

        <td>
          ${convertirMinutos(
            servicio.totalMinutosViaje
          )}
        </td>

        <td>
          ${servicio.totalKilometros}
        </td>

        <td>

          <button
            type="button"
            class="btn btn-sm btn-primary btn-seleccionar-servicio"
            data-id="${servicio.id}"
          >
            Seleccionar
          </button>

        </td>
      `;


      tablaServicios.appendChild(fila);

      const minutosExtra = calcularHorasExtrasServicio(servicio).totalMinutosExtra;
      const tarjeta = document.createElement("div");
      tarjeta.className = "extra-mobile-card";
      tarjeta.innerHTML = `
        <div class="d-flex justify-content-between gap-2 align-items-start mb-2">
          <span class="extra-ticket">${escaparHtml(servicio.numeroTicket)}</span>
          <span class="extra-fecha text-nowrap">${formatearFecha(servicio.fecha)}</span>
        </div>
        <div class="extra-tienda mb-2">${escaparHtml(servicio.tienda?.nombre)}</div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-secondary small">Horas extras</span>
          <span class="extra-tiempo">${convertirMinutos(minutosExtra)}</span>
        </div>
        <button type="button" class="btn btn-primary w-100 btn-script-movil" data-id="${escaparHtml(servicio.id)}">
          <i class="bi bi-file-earmark-text"></i> Generar script
        </button>`;
      tarjetasServiciosMovil.appendChild(tarjeta);
    }
  );


  tablaServiciosContenedor.classList.remove("d-none");
  tarjetasServiciosMovil.classList.remove("d-none");
}


mostrarTodosServicios?.addEventListener("change", filtrarServiciosPorMes);

// ==============================
// FILTRAR POR FECHA
// ==============================

filtroMes.addEventListener(
  "change",
  filtrarServiciosPorMes
);


filtroAnio.addEventListener(
  "change",
  filtrarServiciosPorMes
);
btnMesActual.addEventListener(
  "click",
  () => {

    const hoy =
      new Date();

    filtroMes.value =
      hoy.getMonth();

    filtroAnio.value =
      hoy.getFullYear();

    filtrarServiciosPorMes();
  }
);

btnLimpiarFiltro.addEventListener(
  "click",
  () => {

    mostrarServicios(servicios);
  }
);


// ==============================
// SELECCIONAR SERVICIO
// ==============================

tablaServicios.addEventListener(
  "click",
  async (event) => {

    const boton =
      event.target.closest(
        ".btn-seleccionar-servicio"
      );


    if (!boton) {
      return;
    }


    const id =
      boton.dataset.id;


    await seleccionarServicio(
      id
    );
  }
);


tarjetasServiciosMovil.addEventListener("click", async event => {
  const boton = event.target.closest(".btn-script-movil");
  if (!boton || boton.disabled) return;
  boton.disabled = true;
  try {
    const seleccionado = await seleccionarServicio(boton.dataset.id);
    if (seleccionado) btnGenerarScript.click();
  } finally {
    boton.disabled = false;
  }
});

async function seleccionarServicio(id) {

  try {

    const respuesta =
  await fetch(
    `${API_URL}/api/servicios/${id}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );


    const datos =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.mensaje ||
        "No fue posible consultar el servicio"
      );
    }


    servicioSeleccionado =
      datos.servicio;


    mostrarDetalleServicio(servicioSeleccionado);
    return true;

  } catch (error) {

    console.error(
      "Error seleccionando servicio:",
      error
    );

    alert(error.message);
    return false;
  }
}


// ==============================
// MOSTRAR DETALLE
// ==============================

function mostrarDetalleServicio(servicio) {
  const horasExtras = calcularHorasExtrasServicio(servicio);
  badgeTicket.textContent = servicio.numeroTicket;

  detalleServicio.innerHTML = `

    <div class="col-md-6">

      <label class="text-secondary small">
        Técnico
      </label>

      <div class="fw-semibold">
        ${servicio.usuario.nombre}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Día
      </label>

      <div class="fw-semibold">
        ${servicio.dia}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Fecha
      </label>

      <div class="fw-semibold">
        ${formatearFecha(
          servicio.fecha
        )}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Lugar de salida
      </label>

      <div class="fw-semibold">
        ${servicio.lugarSalida || "N/A"}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Ticket / INC
      </label>

      <div class="fw-semibold">
        ${servicio.numeroTicket}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        CAF / Boleta
      </label>

      <div class="fw-semibold">
        ${
          servicio.numeroCaf ||
          "No registrado"
        }
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Tienda
      </label>

      <div class="fw-semibold">
        ${servicio.tienda.nombre}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Hora ingreso
      </label>

      <div class="fw-semibold">
        ${formatearHora(
          servicio.horaIngreso
        )}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Hora egreso
      </label>

      <div class="fw-semibold">
        ${formatearHora(
          servicio.horaEgreso
        )}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Total atención
      </label>

      <div class="fw-semibold">
        ${convertirMinutos(
          servicio.totalMinutosAtencion
        )}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Kilómetros
      </label>

      <div class="fw-semibold">
        ${servicio.totalKilometros} km
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Inicio viaje
      </label>

      <div class="fw-semibold">
        ${formatearHora(
          servicio.inicioViaje
        )}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Fin viaje
      </label>

      <div class="fw-semibold">
        ${formatearHora(
          servicio.finViaje
        )}
      </div>

    </div>


    <div class="col-md-6">

      <label class="text-secondary small">
        Total viaje
      </label>

      <div class="fw-semibold">
        ${convertirMinutos(
          servicio.totalMinutosViaje
        )}
      </div>

    </div>


    ${
      servicio.inicioRegresoCasa &&
      servicio.finRegresoCasa
        ? `

          <div class="col-12">
            <hr>
          </div>


          <div class="col-md-4">

            <label class="text-secondary small">
              Inicio regreso a casa
            </label>

            <div class="fw-semibold">
              ${formatearHora(
                servicio.inicioRegresoCasa
              )}
            </div>

          </div>


          <div class="col-md-4">

            <label class="text-secondary small">
              Fin regreso a casa
            </label>

            <div class="fw-semibold">
              ${formatearHora(
                servicio.finRegresoCasa
              )}
            </div>

          </div>


          <div class="col-md-4">

            <label class="text-secondary small">
              Total regreso a casa
            </label>

            <div class="fw-semibold">
              ${convertirMinutos(
                servicio.totalMinutosRegresoCasa
              )}
            </div>

          </div>

        `
        : ""
    }


    <div class="col-12">
      <hr>
    </div>


    <div class="col-md-3">

      <label class="text-secondary small">
        Extra de atención
      </label>

      <div class="fw-bold text-primary">
        ${convertirMinutos(
          horasExtras.minutosExtraAtencion
        )}
      </div>

    </div>


    <div class="col-md-3">

      <label class="text-secondary small">
        Extra de viaje
      </label>

      <div class="fw-bold text-primary">
        ${convertirMinutos(
          horasExtras.minutosExtraViaje
        )}
      </div>

    </div>


    <div class="col-md-3">

      <label class="text-secondary small">
        Extra regreso a casa
      </label>

      <div class="fw-bold text-primary">
        ${convertirMinutos(
          horasExtras.minutosExtraRegresoCasa
        )}
      </div>

    </div>


    <div class="col-md-3">

      <label class="text-secondary small">
        Total horas extra
      </label>

      <div class="fw-bold text-success">
        ${convertirMinutos(
          horasExtras.totalMinutosExtra
        )}
      </div>

    </div>


    <div class="col-12">
      <hr>
    </div>


    <div class="col-12">

      <label class="text-secondary small">
        Comentario / Justificación
      </label>

      <div
        class="border rounded p-3 bg-light mt-1"
      >
        ${servicio.trabajoRealizado}
      </div>

    </div>

  `;


  seccionServicioSeleccionado.classList.remove(
    "d-none"
  );


  seccionScript.classList.add(
    "d-none"
  );


  textoScript.value =
    "";


  seccionServicioSeleccionado.scrollIntoView({ behavior: "smooth" });
}


// ==============================
// CANCELAR SELECCIÓN
// ==============================

btnCancelarSeleccion.addEventListener(
  "click",
  () => {

    servicioSeleccionado =
      null;

    seccionServicioSeleccionado.classList.add(
      "d-none"
    );

    seccionScript.classList.add(
      "d-none"
    );

    textoScript.value =
      "";
  }
);


// ==============================
// GENERAR SCRIPT
// ==============================

btnGenerarScript.addEventListener(
  "click",
  () => {

    if (!servicioSeleccionado) {

      alert(
        "Selecciona un servicio primero"
      );

      return;
    }


    const servicio =
      servicioSeleccionado;


    // ==========================
    // CALCULAR HORAS EXTRAS
    // ==========================

    const horasExtras =
      calcularHorasExtrasServicio(
        servicio
      );


    // ==========================
    // ATENCIÓN EXTRA
    // ==========================

    let horaIngresoExtra = "00:00";
    let horaEgresoExtra = "00:00";
    let totalAtencionExtra = "00:00";


    if (
      horasExtras.minutosExtraAtencion > 0
    ) {

      const fechaServicio =
        new Date(servicio.fecha);

      const diaSemana =
        fechaServicio.getDay();


      // Sábado y domingo:
      // toda la atención es extra
      if (esDiaExtraCompleto(servicio.fecha)) {

        horaIngresoExtra =
          formatearHora24(
            servicio.horaIngreso
          );

        horaEgresoExtra =
          formatearHora24(
            servicio.horaEgreso
          );

      } else {

        const ingreso =
          new Date(
            servicio.horaIngreso
          );

        const egreso =
          new Date(
            servicio.horaEgreso
          );


        const fechaLocal = fechaISOCalendario(servicio.fecha);
        const inicioHorarioNormal = new Date(`${fechaLocal}T14:00:00Z`);
        const finHorarioNormal = new Date(Date.parse(`${fechaLocal}T00:00:00Z`) + 86400000);


        // Todo antes de las 08:00
        if (
          egreso <=
          inicioHorarioNormal
        ) {

          horaIngresoExtra =
            formatearHora24(
              servicio.horaIngreso
            );

          horaEgresoExtra =
            formatearHora24(
              servicio.horaEgreso
            );

        }


        // Empieza antes de las 08:00
        // y termina dentro del horario normal
        else if (
          ingreso <
            inicioHorarioNormal &&
          egreso <=
            finHorarioNormal
        ) {

          horaIngresoExtra =
            formatearHora24(
              servicio.horaIngreso
            );

          horaEgresoExtra =
            "08:00";

        }


        // Empieza dentro del horario normal
        // y termina después de las 18:00
        else if (
          ingreso >=
            inicioHorarioNormal &&
          ingreso <
            finHorarioNormal &&
          egreso >
            finHorarioNormal
        ) {

          horaIngresoExtra =
            "18:00";

          horaEgresoExtra =
            formatearHora24(
              servicio.horaEgreso
            );

        }


        // Todo después de las 18:00
        else if (
          ingreso >=
          finHorarioNormal
        ) {

          horaIngresoExtra =
            formatearHora24(
              servicio.horaIngreso
            );

          horaEgresoExtra =
            formatearHora24(
              servicio.horaEgreso
            );

        }

      }


      totalAtencionExtra =
        convertirMinutosFormato(
          horasExtras.minutosExtraAtencion
        );
    }


    // ==========================
    // VIAJE EXTRA
    // ==========================

    let inicioViajeExtra = "00:00";
    let finViajeExtra = "00:00";
    let totalViajeExtra = "00:00";


    if (
      horasExtras.minutosExtraViaje > 0
    ) {

      const fechaServicio =
        new Date(servicio.fecha);

      const diaSemana =
        fechaServicio.getDay();


      // Sábado y domingo:
      // todo el viaje es extra
      if (esDiaExtraCompleto(servicio.fecha)) {

        inicioViajeExtra =
          formatearHora24(
            servicio.inicioViaje
          );

        finViajeExtra =
          formatearHora24(
            servicio.finViaje
          );

      } else {

        const inicio =
          new Date(
            servicio.inicioViaje
          );

        const fin =
          new Date(
            servicio.finViaje
          );


        const fechaLocal = fechaISOCalendario(servicio.fecha);
        const inicioHorarioNormal = new Date(`${fechaLocal}T14:00:00Z`);
        const finHorarioNormal = new Date(Date.parse(`${fechaLocal}T00:00:00Z`) + 86400000);


        // Todo antes de las 08:00
        if (
          fin <=
          inicioHorarioNormal
        ) {

          inicioViajeExtra =
            formatearHora24(
              servicio.inicioViaje
            );

          finViajeExtra =
            formatearHora24(
              servicio.finViaje
            );

        }


        // Empieza antes de 08:00
        // y termina dentro del horario normal
        else if (
          inicio <
            inicioHorarioNormal &&
          fin <=
            finHorarioNormal
        ) {

          inicioViajeExtra =
            formatearHora24(
              servicio.inicioViaje
            );

          finViajeExtra =
            "08:00";

        }


        // Empieza en horario normal
        // y termina después de 18:00
        else if (
          inicio >=
            inicioHorarioNormal &&
          inicio <
            finHorarioNormal &&
          fin >
            finHorarioNormal
        ) {

          inicioViajeExtra =
            "18:00";

          finViajeExtra =
            formatearHora24(
              servicio.finViaje
            );

        }


        // Todo después de 18:00
        else if (
          inicio >=
          finHorarioNormal
        ) {

          inicioViajeExtra =
            formatearHora24(
              servicio.inicioViaje
            );

          finViajeExtra =
            formatearHora24(
              servicio.finViaje
            );

        }

      }


      totalViajeExtra =
        convertirMinutosFormato(
          horasExtras.minutosExtraViaje
        );
    }


    // ==========================
    // REGRESO A CASA EXTRA
    // ==========================

    let inicioRegresoExtra = "00:00";
    let finRegresoExtra = "00:00";
    let totalRegresoExtra = "00:00";


    if (
      horasExtras.minutosExtraRegresoCasa > 0
    ) {

      const fechaServicio =
        new Date(
          servicio.fecha
        );

      const diaSemana =
        fechaServicio.getDay();


      // Sábado y domingo:
      // todo el regreso es extra
      if (esDiaExtraCompleto(servicio.fecha)) {

        inicioRegresoExtra =
          formatearHora24(
            servicio.inicioRegresoCasa
          );

        finRegresoExtra =
          formatearHora24(
            servicio.finRegresoCasa
          );

      } else {

        const inicio =
          new Date(
            servicio.inicioRegresoCasa
          );

        const fin =
          new Date(
            servicio.finRegresoCasa
          );


        const fechaLocal = fechaISOCalendario(servicio.fecha);
        const inicioHorarioNormal = new Date(`${fechaLocal}T14:00:00Z`);
        const finHorarioNormal = new Date(Date.parse(`${fechaLocal}T00:00:00Z`) + 86400000);


        // Todo el regreso antes de 08:00
        if (
          fin <=
          inicioHorarioNormal
        ) {

          inicioRegresoExtra =
            formatearHora24(
              servicio.inicioRegresoCasa
            );

          finRegresoExtra =
            formatearHora24(
              servicio.finRegresoCasa
            );

        }


        // Empieza antes de las 08:00
        // y termina dentro del horario normal
        else if (
          inicio <
            inicioHorarioNormal &&
          fin <=
            finHorarioNormal
        ) {

          inicioRegresoExtra =
            formatearHora24(
              servicio.inicioRegresoCasa
            );

          finRegresoExtra =
            "08:00";

        }


        // Empieza dentro del horario normal
        // y termina después de las 18:00
        else if (
          inicio >=
            inicioHorarioNormal &&
          inicio <
            finHorarioNormal &&
          fin >
            finHorarioNormal
        ) {

          inicioRegresoExtra =
            "18:00";

          finRegresoExtra =
            formatearHora24(
              servicio.finRegresoCasa
            );

        }


        // Todo después de las 18:00
        else if (
          inicio >=
          finHorarioNormal
        ) {

          inicioRegresoExtra =
            formatearHora24(
              servicio.inicioRegresoCasa
            );

          finRegresoExtra =
            formatearHora24(
              servicio.finRegresoCasa
            );

        }

      }


      totalRegresoExtra =
        convertirMinutosFormato(
          horasExtras.minutosExtraRegresoCasa
        );
    }


    // ==========================
    // TEXTO REGRESO A CASA
    // ==========================

    let textoRegresoCasa = "";


    if (
      servicio.inicioRegresoCasa &&
      servicio.finRegresoCasa &&
      horasExtras.minutosExtraRegresoCasa > 0
    ) {

      textoRegresoCasa = `
• Inicio regreso a casa: ${inicioRegresoExtra}
• Fin regreso a casa: ${finRegresoExtra}
• Total horas regreso a casa: ${totalRegresoExtra}`;
    }


    // ==========================
    // TOTAL GENERAL
    // ==========================

    const totalGeneralExtra =
      convertirMinutosFormato(
        horasExtras.totalMinutosExtra
      );


    // ==========================
    // CREAR SCRIPT
    // ==========================

    const script = `
TÉCNICO DEPARTAMENTAL
• Nombre: ${servicio.usuario.nombre}
• Día: ${servicio.dia.toUpperCase()}
• Fecha: ${formatearFecha(servicio.fecha)}
• Lugar de salida: ${servicio.lugarSalida || "N/A"}
• Tienda: ${servicio.tienda.nombre}
• INC / Tarea: ${servicio.numeroTicket}
• No. CAF: ${servicio.numeroCaf || "N/A"}
• Hora de ingreso: ${horaIngresoExtra}
• Hora de egreso: ${horaEgresoExtra}
• Total de horas por atención: ${totalAtencionExtra}
• Total kilómetros: ${servicio.totalKilometros}
• Inicio de viaje: ${inicioViajeExtra}
• Fin de viaje: ${finViajeExtra}
• Total horas de viaje: ${totalViajeExtra}${textoRegresoCasa}
• Comentario: ${servicio.trabajoRealizado}
`.trim();


    textoScript.value =
      script;


    seccionScript.classList.remove(
      "d-none"
    );


    seccionScript.scrollIntoView({
      behavior: "smooth"
    });
  }
);


// ==============================
// COPIAR SCRIPT
// ==============================

btnCopiarScript.addEventListener(
  "click",
  async () => {

    if (!textoScript.value) {
      return;
    }


    try {

      await navigator.clipboard.writeText(
        textoScript.value
      );


      const textoOriginal =
        btnCopiarScript.innerHTML;


      btnCopiarScript.innerHTML = `
        <i class="bi bi-check-lg"></i>
        Copiado
      `;


      setTimeout(
        () => {

          btnCopiarScript.innerHTML =
            textoOriginal;

        },
        1500
      );


    } catch (error) {

      console.error(
        "No se pudo copiar:",
        error
      );


      alert(
        "No fue posible copiar el texto"
      );
    }
  }
);


// ==============================
// INICIAR
// ==============================
const hoy =
  new Date();

filtroMes.value =
  hoy.getMonth();

filtroAnio.value =
  hoy.getFullYear();
  // ==============================
// ABRIR SCRIPT EN WHATSAPP
// ==============================

btnWhatsApp.addEventListener(
  "click",
  () => {

    if (!textoScript.value) {

      alert(
        "Primero debes generar el script"
      );

      return;
    }

    const mensaje =
      encodeURIComponent(
        textoScript.value
      );

    const urlWhatsApp =
      `https://wa.me/?text=${mensaje}`;

    window.open(
      urlWhatsApp,
      "_blank"
    );
  }
);


async function iniciarHorasExtras() {
  try {
    await cargarDiasEspeciales();
    await cargarServicios();
  } catch (error) {
    console.error("Error al cargar días especiales:", error);

    cargandoServicios.classList.add("d-none");
    tablaServiciosContenedor.classList.add("d-none");
    sinServicios.classList.remove("d-none");

    sinServicios.textContent =
      "No se pudieron cargar los días especiales: " + error.message;
  }
}

iniciarHorasExtras();
cargarServicios();