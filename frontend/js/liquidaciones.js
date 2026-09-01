let servicios = [];

// ==============================
// SESIÓN
// ==============================

const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");

// ==============================
// ELEMENTOS DEL DOM
// ==============================

const nombreUsuario =
  document.getElementById(
    "nombreUsuario"
  );

const nombreTecnico =
  document.getElementById(
    "nombreTecnico"
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

const btnMesAnterior =
  document.getElementById(
    "btnMesAnterior"
  );

const btnMesActual =
  document.getElementById(
    "btnMesActual"
  );

const btnMesSiguiente =
  document.getElementById(
    "btnMesSiguiente"
  );

const cargandoServicios =
  document.getElementById(
    "cargandoServicios"
  );

const sinServicios =
  document.getElementById(
    "sinServicios"
  );

const tablaLiquidacionContenedor =
  document.getElementById(
    "tablaLiquidacionContenedor"
  );

const tablaLiquidacion =
  document.getElementById(
    "tablaLiquidacion"
  );

const totalServicios =
  document.getElementById(
    "totalServicios"
  );

const totalKilometros =
  document.getElementById(
    "totalKilometros"
  );

const totalKilometrosTabla =
  document.getElementById(
    "totalKilometrosTabla"
  );

  const btnExportarExcel =
  document.getElementById(
    "btnExportarExcel"
  );
const btnFiltrarSemana =
  document.getElementById(
    "btnFiltrarSemana"
  );

const btnQuitarSemana =
  document.getElementById(
    "btnQuitarSemana"
  );

const fechaInicioSemana =
  document.getElementById(
    "fechaInicioSemana"
  );

const fechaFinSemana =
  document.getElementById(
    "fechaFinSemana"
  );


btnExportarExcel.addEventListener(
  "click",
  async () => {

    const mes =
      Number(filtroMes.value) + 1;

    const anio =
      Number(filtroAnio.value);


    try {

      btnExportarExcel.disabled =
        true;

      btnExportarExcel.innerHTML = `
        <span
          class="spinner-border spinner-border-sm me-1"
        ></span>
        Generando...
      `;


      const inicio = fechaInicioSemana.value;
const fin = fechaFinSemana.value;

let urlExportacion;
let nombreArchivo;

if (inicio && fin) {

  // Exportar únicamente el rango seleccionado
  urlExportacion =
    `${API_URL}/api/liquidaciones/exportar?inicio=${inicio}&fin=${fin}`;

} else {

  // Exportar el mes completo
  urlExportacion =
    `${API_URL}/api/liquidaciones/exportar?mes=${mes}&anio=${anio}`;
}

const respuesta =
  await fetch(
    urlExportacion,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );


      if (!respuesta.ok) {

        const error =
          await respuesta.json();

        throw new Error(
          error.mensaje ||
          "No fue posible generar el Excel"
        );
      }


      const archivo =
        await respuesta.blob();


      const url =
        URL.createObjectURL(
          archivo
        );


      const enlace =
        document.createElement(
          "a"
        );


      enlace.href =
        url;


      enlace.download = nombreArchivo;


      document.body.appendChild(
        enlace
      );


      enlace.click();


      enlace.remove();


      URL.revokeObjectURL(
        url
      );


    } catch (error) {

      console.error(
        "Error exportando Excel:",
        error
      );


      alert(
        error.message
      );


    } finally {

      btnExportarExcel.disabled =
        false;

      btnExportarExcel.innerHTML = `
        <i class="bi bi-file-earmark-excel"></i>
        Exportar Excel
      `;
    }
  }
);
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

    nombreUsuario.textContent =
      usuario.nombre;

    nombreTecnico.textContent =
      usuario.nombre;

  } catch (error) {

    console.error(
      "No fue posible leer los datos del usuario:",
      error
    );

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
// FORMATO DE FECHA
// ==============================

function formatearFecha(fecha) {

  if (!fecha) {
    return "-";
  }

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

  tablaLiquidacionContenedor.classList.add(
    "d-none"
  );

  try {

    const respuesta = await fetch(
    `${API_URL}/api/servicios/mis-servicios`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (
    respuesta.status === 401 ||
    respuesta.status === 403
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

    filtrarServiciosPorMes();

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
// FILTRAR POR MES Y AÑO
// ==============================

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

  mostrarLiquidacion(
    filtrados
  );
}
// ==============================
// FILTRAR POR SEMANA
// ==============================

function filtrarServiciosPorSemana() {

  const inicio =
    document.getElementById(
      "fechaInicioSemana"
    ).value;

  const fin =
    document.getElementById(
      "fechaFinSemana"
    ).value;

  if (!inicio || !fin) {

    alert(
      "Selecciona la fecha de inicio y fin de la semana"
    );

    return;
  }

  const fechaInicio =
    new Date(`${inicio}T00:00:00`);

  const fechaFin =
    new Date(`${fin}T23:59:59`);

  if (fechaInicio > fechaFin) {

    alert(
      "La fecha de inicio no puede ser mayor que la fecha final"
    );

    return;
  }

  const filtrados =
    servicios.filter(
      (servicio) => {

        const fechaServicio =
          new Date(servicio.fecha);

        return (
          fechaServicio >= fechaInicio &&
          fechaServicio <= fechaFin
        );
      }
    );

  mostrarLiquidacion(
    filtrados
  );
}

// ==============================
// MOSTRAR LIQUIDACIÓN
// ==============================

function mostrarLiquidacion(lista) {

  cargandoServicios.classList.add(
    "d-none"
  );

  tablaLiquidacion.innerHTML =
    "";

  let kilometrosAcumulados = 0;

  totalServicios.textContent =
    lista.length;

  if (!lista.length) {

    tablaLiquidacionContenedor.classList.add(
      "d-none"
    );

    sinServicios.classList.remove(
      "d-none"
    );

    totalKilometros.textContent =
      "0 km";

    totalKilometrosTabla.textContent =
      "0";

    return;
  }

  sinServicios.classList.add(
    "d-none"
  );

  lista.forEach(
    (servicio, indice) => {

      const kilometros =
        Number(
          servicio.totalKilometros
        ) || 0;

      kilometrosAcumulados +=
        kilometros;

      const fila =
        document.createElement(
          "tr"
        );

      fila.innerHTML = `
        <td>
          ${indice + 1}
        </td>

        <td>
          ${formatearFecha(
            servicio.fecha
          )}
        </td>

        <td>
          ${
            servicio.tienda.departamento ||
            "-"
          }
        </td>

        <td>
          ${
            servicio.tienda.municipio ||
            "-"
          }
        </td>

        <td>
          ${
            servicio.tienda.nombre ||
            "-"
          }
        </td>

        <td>
          ${
            servicio.numeroTicket ||
            "-"
          }
        </td>

        <td>
          ${
            servicio.numeroCaf ||
            "-"
          }
        </td>

        <td>
          ${
            servicio.trabajoRealizado ||
            "-"
          }
        </td>

        <td>
          ${kilometros}
        </td>

        <td>
          ${kilometros}
        </td>
      `;

      tablaLiquidacion.appendChild(
        fila
      );
    }
  );

  totalKilometros.textContent =
    `${kilometrosAcumulados} km`;

  totalKilometrosTabla.textContent =
    kilometrosAcumulados;

  tablaLiquidacionContenedor.classList.remove(
    "d-none"
  );
}

// ==============================
// CAMBIAR MES
// ==============================

function cambiarMes(
  desplazamiento
) {

  let mes =
    Number(
      filtroMes.value
    );

  let anio =
    Number(
      filtroAnio.value
    );

  mes +=
    desplazamiento;

  if (mes < 0) {

    mes = 11;

    anio--;

  } else if (mes > 11) {

    mes = 0;

    anio++;
  }

  filtroMes.value =
    mes;

  filtroAnio.value =
    anio;

  filtrarServiciosPorMes();
}

// ==============================
// EVENTOS FILTROS
// ==============================

btnFiltrarSemana.addEventListener(
  "click",
  () => {

    filtrarServiciosPorSemana();

  }
);


btnQuitarSemana.addEventListener(
  "click",
  () => {

    fechaInicioSemana.value = "";
    fechaFinSemana.value = "";

    filtrarServiciosPorMes();

  }
);

filtroMes.addEventListener(
  "change",
  filtrarServiciosPorMes
);

filtroAnio.addEventListener(
  "change",
  filtrarServiciosPorMes
);

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

// ==============================
// MES ACTUAL AL INICIAR
// ==============================

const hoy =
  new Date();

filtroMes.value =
  hoy.getMonth();

filtroAnio.value =
  hoy.getFullYear();

// ==============================
// INICIAR
// ==============================

cargarServicios();