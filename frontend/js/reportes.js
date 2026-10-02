let servicios = [];


// =============================================
// SESIÓN
// =============================================

const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");


if (!token || !usuarioGuardado) {

  window.location.href =
    "./login.html";
}


// =============================================
// ELEMENTOS
// =============================================

const sidebar =
  document.getElementById(
    "sidebar"
  );

const btnMenu =
  document.getElementById(
    "btnMenu"
  );

const btnCerrarSesion =
  document.getElementById(
    "btnCerrarSesion"
  );

const nombreUsuario =
  document.getElementById(
    "nombreUsuario"
  );

const menuAdministrarUsuarios =
  document.getElementById(
    "menuAdministrarUsuarios"
  );

const menuAdministrarRepuestos =
  document.getElementById(
    "menuAdministrarRepuestos"
  );


const tipoPeriodo =
  document.getElementById(
    "tipoPeriodo"
  );

const filtroMes =
  document.getElementById(
    "filtroMes"
  );

const filtroAnio =
  document.getElementById(
    "filtroAnio"
  );

const filtroSemana =
  document.getElementById(
    "filtroSemana"
  );

const fechaInicio =
  document.getElementById(
    "fechaInicio"
  );

const fechaFin =
  document.getElementById(
    "fechaFin"
  );

const contenedorMes =
  document.getElementById(
    "contenedorMes"
  );

const contenedorAnio =
  document.getElementById(
    "contenedorAnio"
  );

const contenedorSemana =
  document.getElementById(
    "contenedorSemana"
  );

const contenedorFechaInicio =
  document.getElementById(
    "contenedorFechaInicio"
  );

const contenedorFechaFin =
  document.getElementById(
    "contenedorFechaFin"
  );

const btnGenerarReporte =
  document.getElementById(
    "btnGenerarReporte"
  );

const textoPeriodo =
  document.getElementById(
    "textoPeriodo"
  );


const totalServicios =
  document.getElementById(
    "totalServicios"
  );

const totalKilometros =
  document.getElementById(
    "totalKilometros"
  );

const totalAtencion =
  document.getElementById(
    "totalAtencion"
  );

const totalViaje =
  document.getElementById(
    "totalViaje"
  );

const totalRegresoCasa =
  document.getElementById(
    "totalRegresoCasa"
  );


const extraAtencion =
  document.getElementById(
    "extraAtencion"
  );

const extraViaje =
  document.getElementById(
    "extraViaje"
  );

const extraRegresoCasa =
  document.getElementById(
    "extraRegresoCasa"
  );

const totalHorasExtras =
  document.getElementById(
    "totalHorasExtras"
  );


const cargandoReporte =
  document.getElementById(
    "cargandoReporte"
  );

const sinResultados =
  document.getElementById(
    "sinResultados"
  );

const contenedorTabla =
  document.getElementById(
    "contenedorTabla"
  );

const tablaReporte =
  document.getElementById(
    "tablaReporte"
  );


// =============================================
// VALIDAR USUARIO
// =============================================

let usuario = null;

try {

  usuario =
    JSON.parse(
      usuarioGuardado
    );


  nombreUsuario.textContent =
    usuario.nombre;


  if (
    usuario.rol === "ADMIN"
  ) {

    if (
      menuAdministrarUsuarios
    ) {

      menuAdministrarUsuarios
        .classList.remove(
          "d-none"
        );
    }


    if (
      menuAdministrarRepuestos
    ) {

      menuAdministrarRepuestos
        .classList.remove(
          "d-none"
        );
    }
  }


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


// =============================================
// MENÚ RESPONSIVE
// =============================================

btnMenu.addEventListener(
  "click",
  () => {

    sidebar.classList.toggle(
      "visible"
    );
  }
);


// =============================================
// CERRAR SESIÓN
// =============================================

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


// =============================================
// CONVERTIR MINUTOS
// =============================================

function convertirMinutos(minutos) {

  const total =
    Number(minutos) || 0;

  const horas =
    Math.floor(
      total / 60
    );

  const minutosRestantes =
    total % 60;

  return (
    `${horas} h ` +
    `${minutosRestantes} min`
  );
}


// =============================================
// FECHA SIN PROBLEMAS DE ZONA HORARIA
// =============================================

function obtenerFechaServicio(fecha) {

  if (!fecha) {
    return "";
  }

  return String(fecha)
    .substring(
      0,
      10
    );
}


// =============================================
// FORMATEAR FECHA
// =============================================

function formatearFecha(fecha) {

  const valor =
    obtenerFechaServicio(
      fecha
    );

  if (!valor) {
    return "";
  }

  const partes =
    valor.split("-");

  if (
    partes.length !== 3
  ) {
    return valor;
  }

  return (
    `${partes[2]}/` +
    `${partes[1]}/` +
    `${partes[0]}`
  );
}


// =============================================
// CALCULAR HORAS EXTRAS
// MISMA LÓGICA DE HORAS-EXTRAS.JS
// =============================================

function calcularMinutosExtra(
  fechaInicio,
  fechaFin,
  fechaServicio
) {

  if (
    !fechaInicio ||
    !fechaFin
  ) {

    return 0;
  }


  const inicio =
    new Date(
      fechaInicio
    );

  const fin =
    new Date(
      fechaFin
    );

  const fechaBase =
    new Date(
      fechaServicio
    );


  if (
    isNaN(inicio.getTime()) ||
    isNaN(fin.getTime()) ||
    isNaN(fechaBase.getTime())
  ) {

    return 0;
  }


  const diaSemana =
    fechaBase.getDay();


  const duracionTotal =
    Math.max(
      0,
      Math.round(
        (
          fin -
          inicio
        ) / 60000
      )
    );


  // SÁBADO Y DOMINGO
  // TODO CUENTA COMO EXTRA

  if (
    diaSemana === 0 ||
    diaSemana === 6
  ) {

    return duracionTotal;
  }


  // LUNES A VIERNES
  // HORARIO NORMAL 08:00 - 18:00

  const inicioHorarioNormal =
    new Date(
      fechaBase
    );

  inicioHorarioNormal.setHours(
    8,
    0,
    0,
    0
  );


  const finHorarioNormal =
    new Date(
      fechaBase
    );

  finHorarioNormal.setHours(
    18,
    0,
    0,
    0
  );


  const inicioDentroHorario =
    new Date(
      Math.max(
        inicio.getTime(),
        inicioHorarioNormal.getTime()
      )
    );


  const finDentroHorario =
    new Date(
      Math.min(
        fin.getTime(),
        finHorarioNormal.getTime()
      )
    );


  let minutosNormales = 0;


  if (
    finDentroHorario >
    inicioDentroHorario
  ) {

    minutosNormales =
      Math.round(
        (
          finDentroHorario -
          inicioDentroHorario
        ) / 60000
      );
  }


  const minutosExtra =
    duracionTotal -
    minutosNormales;


  return Math.max(
    0,
    minutosExtra
  );
}


// =============================================
// HORAS EXTRAS POR SERVICIO
// =============================================

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


// =============================================
// GENERAR AÑOS
// =============================================

function cargarAnios() {

  const anioActual =
    new Date().getFullYear();


  filtroAnio.innerHTML =
    "";


  for (
    let anio =
      anioActual + 1;

    anio >=
      anioActual - 5;

    anio--
  ) {

    const opcion =
      document.createElement(
        "option"
      );

    opcion.value =
      anio;

    opcion.textContent =
      anio;


    if (
      anio ===
      anioActual
    ) {

      opcion.selected =
        true;
    }


    filtroAnio.appendChild(
      opcion
    );
  }
}


// =============================================
// FECHA GUATEMALA
// =============================================

function obtenerHoyGuatemala() {

  return new Date()
    .toLocaleDateString(
      "en-CA",
      {
        timeZone:
          "America/Guatemala"
      }
    );
}


// =============================================
// CAMBIAR TIPO DE PERÍODO
// =============================================

function actualizarFiltrosPeriodo() {

  const tipo =
    tipoPeriodo.value;


  contenedorMes
    .classList.add(
      "d-none"
    );

  contenedorAnio
    .classList.add(
      "d-none"
    );

  contenedorSemana
    .classList.add(
      "d-none"
    );

  contenedorFechaInicio
    .classList.add(
      "d-none"
    );

  contenedorFechaFin
    .classList.add(
      "d-none"
    );


  if (
    tipo === "mes"
  ) {

    contenedorMes
      .classList.remove(
        "d-none"
      );

    contenedorAnio
      .classList.remove(
        "d-none"
      );

  }


  if (
    tipo === "semana"
  ) {

    contenedorSemana
      .classList.remove(
        "d-none"
      );

  }


  if (
    tipo === "rango"
  ) {

    contenedorFechaInicio
      .classList.remove(
        "d-none"
      );

    contenedorFechaFin
      .classList.remove(
        "d-none"
      );
  }
}


// =============================================
// CREAR FECHA LOCAL
// =============================================

function crearFechaLocal(
  fechaTexto
) {

  const [
    anio,
    mes,
    dia
  ] =
    fechaTexto
      .split("-")
      .map(Number);


  return new Date(
    anio,
    mes - 1,
    dia,
    12,
    0,
    0
  );
}


// =============================================
// OBTENER INICIO Y FIN DE SEMANA
// LUNES A DOMINGO
// =============================================

function obtenerRangoSemana(
  fechaTexto
) {

  const fecha =
    crearFechaLocal(
      fechaTexto
    );


  let diaSemana =
    fecha.getDay();


  if (
    diaSemana === 0
  ) {

    diaSemana = 7;
  }


  const inicio =
    new Date(
      fecha
    );


  inicio.setDate(
    fecha.getDate() -
    diaSemana +
    1
  );


  const fin =
    new Date(
      inicio
    );


  fin.setDate(
    inicio.getDate() +
    6
  );


  function convertirFecha(
    valor
  ) {

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


    return (
      `${anio}-` +
      `${mes}-` +
      `${dia}`
    );
  }


  return {

    inicio:
      convertirFecha(
        inicio
      ),

    fin:
      convertirFecha(
        fin
      )
  };
}


// =============================================
// FILTRAR REPORTE
// =============================================

function generarReporte() {

  const tipo =
    tipoPeriodo.value;


  let lista = [];

  let descripcionPeriodo =
    "";


  // =========================================
  // MENSUAL
  // =========================================

  if (
    tipo === "mes"
  ) {

    const mes =
      Number(
        filtroMes.value
      );

    const anio =
      Number(
        filtroAnio.value
      );


    lista =
      servicios.filter(
        (servicio) => {

          const fechaTexto =
            obtenerFechaServicio(
              servicio.fecha
            );

          if (!fechaTexto) {
            return false;
          }


          const [
            anioServicio,
            mesServicio
          ] =
            fechaTexto
              .split("-")
              .map(Number);


          return (
            anioServicio ===
              anio &&
            mesServicio ===
              mes + 1
          );
        }
      );


    const nombreMes =
      new Intl.DateTimeFormat(
        "es-GT",
        {
          month: "long"
        }
      ).format(
        new Date(
          anio,
          mes,
          1
        )
      );


    descripcionPeriodo =
      `${
        nombreMes
          .charAt(0)
          .toUpperCase() +
        nombreMes.slice(1)
      } ${anio}`;
  }


  // =========================================
  // SEMANAL
  // =========================================

  if (
    tipo === "semana"
  ) {

    if (
      !filtroSemana.value
    ) {

      alert(
        "Selecciona una fecha de la semana"
      );

      return;
    }


    const rango =
      obtenerRangoSemana(
        filtroSemana.value
      );


    lista =
      servicios.filter(
        (servicio) => {

          const fecha =
            obtenerFechaServicio(
              servicio.fecha
            );

          return (
            fecha >=
              rango.inicio &&
            fecha <=
              rango.fin
          );
        }
      );


    descripcionPeriodo =
      `Semana del ` +
      `${formatearFecha(
        rango.inicio
      )} al ` +
      `${formatearFecha(
        rango.fin
      )}`;
  }


  // =========================================
  // RANGO PERSONALIZADO
  // =========================================

  if (
    tipo === "rango"
  ) {

    if (
      !fechaInicio.value ||
      !fechaFin.value
    ) {

      alert(
        "Selecciona la fecha inicial y final"
      );

      return;
    }


    if (
      fechaInicio.value >
      fechaFin.value
    ) {

      alert(
        "La fecha inicial no puede ser mayor que la fecha final"
      );

      return;
    }


    lista =
      servicios.filter(
        (servicio) => {

          const fecha =
            obtenerFechaServicio(
              servicio.fecha
            );


          return (
            fecha >=
              fechaInicio.value &&
            fecha <=
              fechaFin.value
          );
        }
      );


    descripcionPeriodo =
      `${formatearFecha(
        fechaInicio.value
      )} al ` +
      `${formatearFecha(
        fechaFin.value
      )}`;
  }


  textoPeriodo.innerHTML = `

    <i
      class="bi bi-calendar3 me-2"
    ></i>

    <strong>
      Período:
    </strong>

    ${descripcionPeriodo}

  `;


  calcularResumen(
    lista
  );


  mostrarTabla(
    lista
  );
}


// =============================================
// CALCULAR RESUMEN
// =============================================

function calcularResumen(
  lista
) {

  let kilometros = 0;

  let minutosAtencion = 0;

  let minutosViaje = 0;

  let minutosRegreso = 0;


  let minutosExtraAtencion = 0;

  let minutosExtraViaje = 0;

  let minutosExtraRegreso = 0;


  lista.forEach(
    (servicio) => {

      kilometros +=
        Number(
          servicio.totalKilometros
        ) || 0;


      minutosAtencion +=
        Number(
          servicio.totalMinutosAtencion
        ) || 0;


      minutosViaje +=
        Number(
          servicio.totalMinutosViaje
        ) || 0;


      minutosRegreso +=
        Number(
          servicio.totalMinutosRegresoCasa
        ) || 0;


      const extras =
        calcularHorasExtrasServicio(
          servicio
        );


      minutosExtraAtencion +=
        extras
          .minutosExtraAtencion;


      minutosExtraViaje +=
        extras
          .minutosExtraViaje;


      minutosExtraRegreso +=
        extras
          .minutosExtraRegresoCasa;
    }
  );


  const minutosExtraTotal =
    minutosExtraAtencion +
    minutosExtraViaje +
    minutosExtraRegreso;


  totalServicios.textContent =
    lista.length;


  totalKilometros.textContent =
    `${kilometros} km`;


  totalAtencion.textContent =
    convertirMinutos(
      minutosAtencion
    );


  totalViaje.textContent =
    convertirMinutos(
      minutosViaje
    );


  totalRegresoCasa.textContent =
    convertirMinutos(
      minutosRegreso
    );


  extraAtencion.textContent =
    convertirMinutos(
      minutosExtraAtencion
    );


  extraViaje.textContent =
    convertirMinutos(
      minutosExtraViaje
    );


  extraRegresoCasa.textContent =
    convertirMinutos(
      minutosExtraRegreso
    );


  totalHorasExtras.textContent =
    convertirMinutos(
      minutosExtraTotal
    );
}


// =============================================
// MOSTRAR TABLA
// =============================================

function mostrarTabla(
  lista
) {

  tablaReporte.innerHTML =
    "";


  cargandoReporte
    .classList.add(
      "d-none"
    );


  if (
    !lista.length
  ) {

    contenedorTabla
      .classList.add(
        "d-none"
      );

    sinResultados
      .classList.remove(
        "d-none"
      );

    return;
  }


  sinResultados
    .classList.add(
      "d-none"
    );

  contenedorTabla
    .classList.remove(
      "d-none"
    );


  lista.forEach(
    (servicio) => {

      const extras =
        calcularHorasExtrasServicio(
          servicio
        );


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
            ${
              servicio.tienda?.nombre ||
              "N/A"
            }
          </div>

          <small class="text-secondary">

            Determinante:
            ${
              servicio.tienda?.codigo ||
              "N/A"
            }

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
          ${
            Number(
              servicio.totalKilometros
            ) || 0
          }
        </td>

        <td>

          <span
            class="${
              extras.totalMinutosExtra > 0
                ? "fw-bold text-success"
                : "text-secondary"
            }"
          >

            ${convertirMinutos(
              extras.totalMinutosExtra
            )}

          </span>

        </td>

      `;


      tablaReporte.appendChild(
        fila
      );
    }
  );
}


// =============================================
// CARGAR SERVICIOS
// =============================================

async function cargarServicios() {

  cargandoReporte
    .classList.remove(
      "d-none"
    );

  sinResultados
    .classList.add(
      "d-none"
    );

  contenedorTabla
    .classList.add(
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
        "No fue posible cargar los servicios"
      );
    }


    servicios =
      datos.servicios || [];


    generarReporte();


  } catch (error) {

    console.error(
      "Error cargando reporte:",
      error
    );


    cargandoReporte
      .classList.add(
        "d-none"
      );

    contenedorTabla
      .classList.add(
        "d-none"
      );

    sinResultados
      .classList.remove(
        "d-none"
      );

    sinResultados.innerHTML = `

      <div
        class="alert alert-danger m-3"
      >

        <i
          class="bi bi-exclamation-triangle me-1"
        ></i>

        ${error.message}

      </div>

    `;
  }
}


// =============================================
// EVENTOS
// =============================================

tipoPeriodo.addEventListener(
  "change",
  () => {

    actualizarFiltrosPeriodo();
  }
);


btnGenerarReporte.addEventListener(
  "click",
  () => {

    generarReporte();
  }
);


// =============================================
// INICIAR
// =============================================

function iniciar() {

  cargarAnios();


  const hoy =
    obtenerHoyGuatemala();


  const [
    anio,
    mes
  ] =
    hoy
      .split("-")
      .map(Number);


  filtroMes.value =
    mes - 1;

  filtroAnio.value =
    anio;

  filtroSemana.value =
    hoy;


  fechaInicio.value =
    hoy;

  fechaFin.value =
    hoy;


  actualizarFiltrosPeriodo();


  cargarServicios();
}


iniciar();