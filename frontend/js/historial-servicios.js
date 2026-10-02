// =============================================
// HISTORIAL DE SERVICIOS - TECHASSIST
// =============================================


// =============================================
// VARIABLES GENERALES
// =============================================

let servicios = [];
let serviciosFiltrados = [];
let servicioSeleccionado = null;

const serviciosSeleccionados = new Set();


// =============================================
// SESIÓN
// =============================================

const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");


// =============================================
// DOM
// =============================================

const sidebar =
  document.getElementById("sidebar");

const btnMenu =
  document.getElementById("btnMenu");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const nombreUsuario =
  document.getElementById("nombreUsuario");

const menuAdministrarUsuarios =
  document.getElementById(
    "menuAdministrarUsuarios"
  );

const menuAdministrarRepuestos =
  document.getElementById(
    "menuAdministrarRepuestos"
  );


// =============================================
// FILTROS
// =============================================

const filtroMes =
  document.getElementById("filtroMes");

const filtroFecha =
  document.getElementById("filtroFecha");

const filtroRango =
  document.getElementById("filtroRango");

const contenedorFiltroMes =
  document.getElementById(
    "contenedorFiltroMes"
  );

const contenedorFiltroFecha =
  document.getElementById(
    "contenedorFiltroFecha"
  );

const contenedorFiltroRango =
  document.getElementById(
    "contenedorFiltroRango"
  );

const selectMes =
  document.getElementById("selectMes");

const selectAnio =
  document.getElementById("selectAnio");

const fechaExacta =
  document.getElementById("fechaExacta");

const fechaDesde =
  document.getElementById("fechaDesde");

const fechaHasta =
  document.getElementById("fechaHasta");

const buscarServicio =
  document.getElementById("buscarServicio");

const btnLimpiarFiltros =
  document.getElementById(
    "btnLimpiarFiltros"
  );


// =============================================
// TABLA
// =============================================

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

const contadorServicios =
  document.getElementById(
    "contadorServicios"
  );

const seleccionarTodos =
  document.getElementById(
    "seleccionarTodos"
  );

const btnEliminarSeleccionados =
  document.getElementById(
    "btnEliminarSeleccionados"
  );

const contadorSeleccionados =
  document.getElementById(
    "contadorSeleccionados"
  );


// =============================================
// MODAL
// =============================================

const modalDetalleServicio =
  document.getElementById(
    "modalDetalleServicio"
  );

const contenidoDetalleServicio =
  document.getElementById(
    "contenidoDetalleServicio"
  );

const cargandoDetalle =
  document.getElementById(
    "cargandoDetalle"
  );

const btnEliminarServicio =
  document.getElementById(
    "btnEliminarServicio"
  );

const btnEditarServicio =
  document.getElementById(
    "btnEditarServicio"
  );


// =============================================
// VERIFICAR SESIÓN
// =============================================

if (!token || !usuarioGuardado) {

  window.location.href =
    "./login.html";

} else {

  try {

    const usuario =
      JSON.parse(usuarioGuardado);

    nombreUsuario.textContent =
      usuario.nombre;


    if (usuario.rol === "ADMIN") {

      if (menuAdministrarUsuarios) {

        menuAdministrarUsuarios
          .classList.remove("d-none");
      }


      if (menuAdministrarRepuestos) {

        menuAdministrarRepuestos
          .classList.remove("d-none");
      }
    }

  } catch (error) {

    console.error(
      "Error leyendo sesión:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
      "./login.html";
  }
}


// =============================================
// MENÚ LATERAL
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

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
      "./login.html";
  }
);


// =============================================
// FUNCIONES DE FECHA
// =============================================

function obtenerFechaLocal(fecha) {

  if (!fecha) {
    return null;
  }


  const texto =
    String(fecha).substring(
      0,
      10
    );


  const partes =
    texto.split("-");


  if (partes.length !== 3) {
    return null;
  }


  return {

    anio:
      Number(partes[0]),

    mes:
      Number(partes[1]) - 1,

    dia:
      Number(partes[2]),

    texto
  };
}


// =============================================
// FORMATEAR FECHA
// =============================================

function formatearFecha(fecha) {

  const valor =
    obtenerFechaLocal(fecha);


  if (!valor) {
    return "No registrada";
  }


  const dia =
    String(valor.dia)
      .padStart(2, "0");

  const mes =
    String(valor.mes + 1)
      .padStart(2, "0");


  return `${dia}/${mes}/${valor.anio}`;
}


// =============================================
// FORMATEAR HORA
// =============================================

function formatearHora(fechaHora) {

  if (!fechaHora) {
    return "No registrado";
  }


  return new Date(
    fechaHora
  ).toLocaleTimeString(
    "es-GT",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  );
}


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


  if (horas === 0) {

    return `${minutosRestantes} min`;
  }


  return `${horas} h ${minutosRestantes} min`;
}


// =============================================
// CONFIGURAR FILTROS INICIALES
// =============================================

function configurarFiltrosIniciales() {

  const fechaGuatemala =
    new Date().toLocaleDateString(
      "en-CA",
      {
        timeZone:
          "America/Guatemala"
      }
    );


  const [
    anioActual,
    mesActual
  ] =
    fechaGuatemala
      .split("-")
      .map(Number);


  // Mes actual

  selectMes.value =
    String(
      mesActual - 1
    );


  // Crear años

  selectAnio.innerHTML =
    "";


  const inicio =
    anioActual - 5;

  const fin =
    anioActual + 1;


  for (
    let anio = fin;
    anio >= inicio;
    anio--
  ) {

    const opcion =
      document.createElement(
        "option"
      );


    opcion.value =
      String(anio);

    opcion.textContent =
      String(anio);


    if (
      anio === anioActual
    ) {

      opcion.selected =
        true;
    }


    selectAnio.appendChild(
      opcion
    );
  }


  // Fechas

  fechaExacta.value =
    fechaGuatemala;

  fechaDesde.value =
    fechaGuatemala;

  fechaHasta.value =
    fechaGuatemala;
}


// =============================================
// CAMBIAR TIPO DE FILTRO
// =============================================

function actualizarTipoFiltro() {

  contenedorFiltroMes
    .classList.add(
      "d-none"
    );

  contenedorFiltroFecha
    .classList.add(
      "d-none"
    );

  contenedorFiltroRango
    .classList.add(
      "d-none"
    );


  if (filtroMes.checked) {

    contenedorFiltroMes
      .classList.remove(
        "d-none"
      );

  } else if (
    filtroFecha.checked
  ) {

    contenedorFiltroFecha
      .classList.remove(
        "d-none"
      );

  } else {

    contenedorFiltroRango
      .classList.remove(
        "d-none"
      );
  }


  aplicarFiltros();
}


// =============================================
// EVENTOS TIPO FILTRO
// =============================================

filtroMes.addEventListener(
  "change",
  actualizarTipoFiltro
);

filtroFecha.addEventListener(
  "change",
  actualizarTipoFiltro
);

filtroRango.addEventListener(
  "change",
  actualizarTipoFiltro
);


// =============================================
// CARGAR SERVICIOS
// =============================================

async function cargarServicios() {

  cargandoServicios
    .classList.remove(
      "d-none"
    );

  tablaServiciosContenedor
    .classList.add(
      "d-none"
    );

  sinServicios
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


    // Token vencido

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


    aplicarFiltros();


  } catch (error) {

    console.error(
      "Error cargando servicios:",
      error
    );


    await Swal.fire({

      icon: "error",

      title:
        "No se pudieron cargar los servicios",

      text:
        error.message,

      confirmButtonText:
        "Aceptar"
    });


  } finally {

    cargandoServicios
      .classList.add(
        "d-none"
      );
  }
}


// =============================================
// APLICAR FILTROS
// =============================================

function aplicarFiltros() {

  const busqueda =
    buscarServicio.value
      .trim()
      .toLowerCase();


  serviciosFiltrados =
    servicios.filter(
      (servicio) => {

        const fecha =
          obtenerFechaLocal(
            servicio.fecha
          );


        if (!fecha) {
          return false;
        }


        // =====================================
        // MES / AÑO
        // =====================================

        if (filtroMes.checked) {

          const mes =
            Number(
              selectMes.value
            );

          const anio =
            Number(
              selectAnio.value
            );


          if (
            fecha.mes !== mes ||
            fecha.anio !== anio
          ) {

            return false;
          }
        }


        // =====================================
        // FECHA EXACTA
        // =====================================

        if (filtroFecha.checked) {

          if (
            fechaExacta.value &&
            fecha.texto !==
              fechaExacta.value
          ) {

            return false;
          }
        }


        // =====================================
        // RANGO DE FECHAS
        // =====================================

        if (filtroRango.checked) {

          if (
            fechaDesde.value &&
            fecha.texto <
              fechaDesde.value
          ) {

            return false;
          }


          if (
            fechaHasta.value &&
            fecha.texto >
              fechaHasta.value
          ) {

            return false;
          }
        }


        // =====================================
        // BÚSQUEDA
        // =====================================

        if (busqueda) {

          const ticket =
            String(
              servicio.numeroTicket ||
              ""
            ).toLowerCase();


          const tienda =
            String(
              servicio.tienda?.nombre ||
              ""
            ).toLowerCase();


          const codigo =
            String(
              servicio.tienda?.codigo ||
              ""
            ).toLowerCase();


          const trabajo =
            String(
              servicio.trabajoRealizado ||
              ""
            ).toLowerCase();


          const coincide =
            ticket.includes(
              busqueda
            ) ||
            tienda.includes(
              busqueda
            ) ||
            codigo.includes(
              busqueda
            ) ||
            trabajo.includes(
              busqueda
            );


          if (!coincide) {
            return false;
          }
        }


        return true;
      }
    );


  // ===========================================
  // QUITAR SELECCIONES QUE YA NO SON VISIBLES
  // ===========================================

  const idsVisibles =
    new Set(
      serviciosFiltrados.map(
        (servicio) =>
          servicio.id
      )
    );


  for (
    const id of
      serviciosSeleccionados
  ) {

    if (
      !idsVisibles.has(id)
    ) {

      serviciosSeleccionados
        .delete(id);
    }
  }


  renderizarServicios();

  actualizarSeleccion();
}


// =============================================
// RENDERIZAR SERVICIOS
// =============================================

function renderizarServicios() {

  tablaServicios.innerHTML =
    "";


  const cantidad =
    serviciosFiltrados.length;


  contadorServicios.textContent =
    cantidad === 1
      ? "1 servicio encontrado"
      : `${cantidad} servicios encontrados`;


  // Sin resultados

  if (cantidad === 0) {

    tablaServiciosContenedor
      .classList.add(
        "d-none"
      );

    sinServicios
      .classList.remove(
        "d-none"
      );

    return;
  }


  sinServicios
    .classList.add(
      "d-none"
    );

  tablaServiciosContenedor
    .classList.remove(
      "d-none"
    );


  serviciosFiltrados.forEach(
    (servicio) => {

      const fila =
        document.createElement(
          "tr"
        );


      const marcado =
        serviciosSeleccionados.has(
          servicio.id
        );


      fila.innerHTML = `

        <td class="text-center">

          <input
            type="checkbox"
            class="form-check-input check-servicio"
            data-id="${servicio.id}"
            ${marcado ? "checked" : ""}
          >

        </td>


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
              servicio.tienda
                ?.nombre || ""
            }
          </div>


          <small
            class="text-secondary"
          >

            ${
              servicio.tienda
                ?.codigo
                ? `Det. ${servicio.tienda.codigo}`
                : ""
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


        <td
          class="text-center"
        >

          <div
            class="btn-group btn-group-sm"
          >

            <button
              type="button"
              class="btn btn-outline-primary btn-ver"
              data-id="${servicio.id}"
              title="Ver servicio"
            >

              <i
                class="bi bi-eye"
              ></i>

            </button>


            <button
              type="button"
              class="btn btn-outline-danger btn-eliminar"
              data-id="${servicio.id}"
              title="Eliminar servicio"
            >

              <i
                class="bi bi-trash"
              ></i>

            </button>

          </div>

        </td>
      `;


      tablaServicios
        .appendChild(
          fila
        );
    }
  );
}


// =============================================
// ACTUALIZAR SELECCIÓN
// =============================================

function actualizarSeleccion() {

  const cantidad =
    serviciosSeleccionados.size;


  contadorSeleccionados
    .textContent =
      String(cantidad);


  btnEliminarSeleccionados
    .disabled =
      cantidad === 0;


  const visibles =
    serviciosFiltrados.length;


  const seleccionadosVisibles =
    serviciosFiltrados.filter(
      (servicio) =>
        serviciosSeleccionados.has(
          servicio.id
        )
    ).length;


  seleccionarTodos.checked =
    visibles > 0 &&
    seleccionadosVisibles ===
      visibles;


  seleccionarTodos.indeterminate =
    seleccionadosVisibles > 0 &&
    seleccionadosVisibles <
      visibles;
}


// =============================================
// CHECK INDIVIDUAL
// =============================================

tablaServicios.addEventListener(
  "change",
  (event) => {

    const check =
      event.target.closest(
        ".check-servicio"
      );


    if (!check) {
      return;
    }


    const id =
      check.dataset.id;


    if (check.checked) {

      serviciosSeleccionados
        .add(id);

    } else {

      serviciosSeleccionados
        .delete(id);
    }


    actualizarSeleccion();
  }
);


// =============================================
// SELECCIONAR TODOS
// =============================================

seleccionarTodos.addEventListener(
  "change",
  () => {

    serviciosFiltrados.forEach(
      (servicio) => {

        if (
          seleccionarTodos.checked
        ) {

          serviciosSeleccionados
            .add(
              servicio.id
            );

        } else {

          serviciosSeleccionados
            .delete(
              servicio.id
            );
        }
      }
    );


    renderizarServicios();

    actualizarSeleccion();
  }
);


// =============================================
// EVENTOS DE LA TABLA
// =============================================

tablaServicios.addEventListener(
  "click",
  async (event) => {

    // VER

    const botonVer =
      event.target.closest(
        ".btn-ver"
      );


    if (botonVer) {

      await verDetalleServicio(
        botonVer.dataset.id
      );

      return;
    }


    // ELIMINAR

    const botonEliminar =
      event.target.closest(
        ".btn-eliminar"
      );


    if (botonEliminar) {

      const servicio =
        servicios.find(
          (item) =>
            item.id ===
            botonEliminar.dataset.id
        );


      if (servicio) {

        await eliminarServicioIndividual(
          servicio
        );
      }
    }
  }
);


// =============================================
// VER DETALLE
// =============================================

async function verDetalleServicio(
  id
) {

  const modal =
    bootstrap.Modal
      .getOrCreateInstance(
        modalDetalleServicio
      );


  contenidoDetalleServicio
    .innerHTML =
      "";


  cargandoDetalle
    .classList.remove(
      "d-none"
    );


  btnEliminarServicio
    .classList.remove(
      "d-none"
    );

  btnEditarServicio
    .classList.remove(
      "d-none"
    );


  modal.show();


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
        "No fue posible consultar el servicio"
      );
    }


    servicioSeleccionado =
      datos.servicio;


    mostrarDetalle(
      servicioSeleccionado
    );


  } catch (error) {

    console.error(
      "Error consultando servicio:",
      error
    );


    contenidoDetalleServicio
      .innerHTML = `

        <div
          class="alert alert-danger"
        >

          ${error.message}

        </div>
      `;


  } finally {

    cargandoDetalle
      .classList.add(
        "d-none"
      );
  }
}


// =============================================
// MOSTRAR DETALLE
// =============================================

function mostrarDetalle(
  servicio
) {

  contenidoDetalleServicio
    .innerHTML = `

      <div class="row g-4">


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
            Técnico
          </label>

          <div class="fw-semibold">

            ${
              servicio.usuario
                ?.nombre ||
              ""
            }

          </div>

        </div>


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
            Fecha
          </label>

          <div class="fw-semibold">

            ${formatearFecha(
              servicio.fecha
            )}

          </div>

        </div>


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
            Ticket / INC
          </label>

          <div class="fw-semibold">

            ${
              servicio.numeroTicket
            }

          </div>

        </div>


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
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

          <label
            class="text-secondary small"
          >
            Lugar de salida
          </label>

          <div class="fw-semibold">

            ${
              servicio.lugarSalida ||
              "No registrado"
            }

          </div>

        </div>


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
            Determinante
          </label>

          <div class="fw-semibold">

            ${
              servicio.tienda
                ?.codigo ||
              ""
            }

          </div>

        </div>


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
            Tienda
          </label>

          <div class="fw-semibold">

            ${
              servicio.tienda
                ?.nombre ||
              ""
            }

          </div>

        </div>


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
            Departamento
          </label>

          <div class="fw-semibold">

            ${
              servicio.tienda
                ?.departamento ||
              ""
            }

          </div>

        </div>


        <div class="col-md-6">

          <label
            class="text-secondary small"
          >
            Municipio
          </label>

          <div class="fw-semibold">

            ${
              servicio.tienda
                ?.municipio ||
              ""
            }

          </div>

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- ATENCIÓN -->

        <div class="col-12">

          <h6 class="fw-bold">

            <i
              class="bi bi-clock me-1"
            ></i>

            Atención

          </h6>

        </div>


        <div class="col-md-4">

          <label
            class="text-secondary small"
          >
            Hora ingreso
          </label>

          <div class="fw-semibold">

            ${formatearHora(
              servicio.horaIngreso
            )}

          </div>

        </div>


        <div class="col-md-4">

          <label
            class="text-secondary small"
          >
            Hora egreso
          </label>

          <div class="fw-semibold">

            ${formatearHora(
              servicio.horaEgreso
            )}

          </div>

        </div>


        <div class="col-md-4">

          <label
            class="text-secondary small"
          >
            Total atención
          </label>

          <div class="fw-semibold">

            ${convertirMinutos(
              servicio.totalMinutosAtencion
            )}

          </div>

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- VIAJE -->

        <div class="col-12">

          <h6 class="fw-bold">

            <i
              class="bi bi-car-front me-1"
            ></i>

            Viaje

          </h6>

        </div>


        <div class="col-md-4">

          <label
            class="text-secondary small"
          >
            Inicio viaje
          </label>

          <div class="fw-semibold">

            ${formatearHora(
              servicio.inicioViaje
            )}

          </div>

        </div>


        <div class="col-md-4">

          <label
            class="text-secondary small"
          >
            Fin viaje
          </label>

          <div class="fw-semibold">

            ${formatearHora(
              servicio.finViaje
            )}

          </div>

        </div>


        <div class="col-md-4">

          <label
            class="text-secondary small"
          >
            Total viaje
          </label>

          <div class="fw-semibold">

            ${convertirMinutos(
              servicio.totalMinutosViaje
            )}

          </div>

        </div>


        <div class="col-md-4">

          <label
            class="text-secondary small"
          >
            Kilómetros
          </label>

          <div class="fw-semibold">

            ${
              Number(
                servicio.totalKilometros
              ) || 0
            } km

          </div>

        </div>


        ${
          servicio.inicioRegresoCasa ||
          servicio.finRegresoCasa

            ? `

              <div class="col-12">
                <hr>
              </div>


              <div class="col-12">

                <h6 class="fw-bold">

                  <i
                    class="bi bi-house-door me-1"
                  ></i>

                  Regreso a casa

                </h6>

              </div>


              <div class="col-md-4">

                <label
                  class="text-secondary small"
                >
                  Inicio regreso
                </label>

                <div class="fw-semibold">

                  ${formatearHora(
                    servicio.inicioRegresoCasa
                  )}

                </div>

              </div>


              <div class="col-md-4">

                <label
                  class="text-secondary small"
                >
                  Fin regreso
                </label>

                <div class="fw-semibold">

                  ${formatearHora(
                    servicio.finRegresoCasa
                  )}

                </div>

              </div>


              <div class="col-md-4">

                <label
                  class="text-secondary small"
                >
                  Total regreso
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


        <!-- TRABAJO -->

        <div class="col-12">

          <label
            class="text-secondary small"
          >
            Trabajo realizado / Justificación
          </label>

          <div
            class="border rounded p-3 bg-light mt-1"
          >

            ${
              servicio.trabajoRealizado ||
              ""
            }

          </div>

        </div>


      </div>
    `;
}


// =============================================
// OBTENER FECHA PARA INPUT
// =============================================

function obtenerFechaInput(fecha) {

  if (!fecha) {
    return "";
  }

  return String(fecha).substring(
    0,
    10
  );
}


// =============================================
// OBTENER HORA PARA INPUT
// =============================================

function obtenerHoraInput(fechaHora) {

  if (!fechaHora) {
    return "";
  }

  const fecha =
    new Date(fechaHora);

  return fecha.toLocaleTimeString(
    "en-GB",
    {
      timeZone:
        "America/Guatemala",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }
  );
}


// =============================================
// MOSTRAR FORMULARIO DE EDICIÓN
// =============================================

function mostrarFormularioEdicion(
  servicio
) {

  const tieneRegresoCasa =
    Boolean(
      servicio.inicioRegresoCasa ||
      servicio.finRegresoCasa
    );


  contenidoDetalleServicio.innerHTML = `

    <form id="formEditarServicio">

      <div class="row g-3">


        <!-- FECHA -->

        <div class="col-md-6">

          <label
            for="editarFecha"
            class="form-label"
          >
            Fecha
          </label>

          <input
            type="date"
            id="editarFecha"
            class="form-control"
            value="${obtenerFechaInput(
              servicio.fecha
            )}"
            required
          >

        </div>


        <!-- TIENDA -->

        <div class="col-md-6">

          <label
            for="editarCodigoTienda"
            class="form-label"
          >
            Código tienda / Determinante
          </label>

          <input
            type="number"
            id="editarCodigoTienda"
            class="form-control"
            value="${
              servicio.tienda?.codigo || ""
            }"
            required
          >

        </div>


        <!-- TICKET -->

        <div class="col-md-6">

          <label
            for="editarTicket"
            class="form-label"
          >
            Ticket / INC
          </label>

          <input
            type="text"
            id="editarTicket"
            class="form-control"
            value="${
              servicio.numeroTicket || ""
            }"
            required
          >

        </div>


        <!-- CAF -->

        <div class="col-md-6">

          <label
            for="editarCaf"
            class="form-label"
          >
            CAF / Boleta
          </label>

          <input
            type="text"
            id="editarCaf"
            class="form-control"
            value="${
              servicio.numeroCaf || ""
            }"
          >

        </div>


        <!-- LUGAR DE SALIDA -->

        <div class="col-12">

          <label
            for="editarLugarSalida"
            class="form-label"
          >
            Lugar de salida
          </label>

          <input
            type="text"
            id="editarLugarSalida"
            class="form-control"
            value="${
              servicio.lugarSalida || ""
            }"
            placeholder="Ejemplo: Cobán"
          >

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- ATENCIÓN -->

        <div class="col-12">

          <h6 class="fw-bold mb-0">

            <i class="bi bi-clock me-1"></i>

            Atención

          </h6>

        </div>


        <div class="col-md-6">

          <label
            for="editarIngreso"
            class="form-label"
          >
            Hora ingreso
          </label>

          <input
            type="time"
            id="editarIngreso"
            class="form-control"
            value="${obtenerHoraInput(
              servicio.horaIngreso
            )}"
          >

        </div>


        <div class="col-md-6">

          <label
            for="editarEgreso"
            class="form-label"
          >
            Hora egreso
          </label>

          <input
            type="time"
            id="editarEgreso"
            class="form-control"
            value="${obtenerHoraInput(
              servicio.horaEgreso
            )}"
          >

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- VIAJE -->

        <div class="col-12">

          <h6 class="fw-bold mb-0">

            <i
              class="bi bi-car-front me-1"
            ></i>

            Viaje

          </h6>

        </div>


        <div class="col-md-6">

          <label
            for="editarInicioViaje"
            class="form-label"
          >
            Inicio viaje
          </label>

          <input
            type="time"
            id="editarInicioViaje"
            class="form-control"
            value="${obtenerHoraInput(
              servicio.inicioViaje
            )}"
          >

        </div>


        <div class="col-md-6">

          <label
            for="editarFinViaje"
            class="form-label"
          >
            Fin viaje
          </label>

          <input
            type="time"
            id="editarFinViaje"
            class="form-control"
            value="${obtenerHoraInput(
              servicio.finViaje
            )}"
          >

        </div>


        <!-- KILÓMETROS -->

        <div class="col-md-6">

          <label
            for="editarKilometros"
            class="form-label"
          >
            Kilómetros
          </label>

          <input
            type="number"
            id="editarKilometros"
            class="form-control"
            min="0"
            value="${
              Number(
                servicio.totalKilometros
              ) || 0
            }"
          >

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- REGRESO A CASA -->

        <div class="col-12">

          <div class="form-check form-switch">

            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="editarActivarRegresoCasa"
              ${
                tieneRegresoCasa
                  ? "checked"
                  : ""
              }
            >

            <label
              class="form-check-label fw-semibold"
              for="editarActivarRegresoCasa"
            >
              Agregar viaje de regreso a casa
            </label>

          </div>

        </div>


        <div
          class="col-12 ${
            tieneRegresoCasa
              ? ""
              : "d-none"
          }"
          id="editarCamposRegresoCasa"
        >

          <div class="row g-3 mt-1">


            <div class="col-md-4">

              <label
                for="editarInicioRegresoCasa"
                class="form-label"
              >
                Inicio regreso a casa
              </label>

              <input
                type="time"
                id="editarInicioRegresoCasa"
                class="form-control"
                value="${obtenerHoraInput(
                  servicio.inicioRegresoCasa
                )}"
              >

            </div>


            <div class="col-md-4">

              <label
                for="editarFinRegresoCasa"
                class="form-label"
              >
                Fin regreso a casa
              </label>

              <input
                type="time"
                id="editarFinRegresoCasa"
                class="form-control"
                value="${obtenerHoraInput(
                  servicio.finRegresoCasa
                )}"
              >

            </div>


            <div class="col-md-4">

              <label
                for="editarTotalRegresoCasa"
                class="form-label"
              >
                Total regreso
              </label>

              <input
                type="text"
                id="editarTotalRegresoCasa"
                class="form-control"
                value="${convertirMinutos(
                  servicio.totalMinutosRegresoCasa
                )}"
                readonly
              >

            </div>


          </div>

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- TRABAJO -->

        <div class="col-12">

          <label
            for="editarTrabajo"
            class="form-label"
          >
            Trabajo realizado / Justificación
          </label>

          <textarea
            id="editarTrabajo"
            class="form-control"
            rows="4"
            required
          >${
            servicio.trabajoRealizado || ""
          }</textarea>

        </div>


        <!-- BOTONES -->

        <div
          class="col-12 d-flex justify-content-end gap-2"
        >

          <button
            type="button"
            class="btn btn-outline-secondary"
            id="btnCancelarEdicion"
          >

            <i
              class="bi bi-x-lg me-1"
            ></i>

            Cancelar

          </button>


          <button
            type="submit"
            class="btn btn-success"
          >

            <i
              class="bi bi-check-lg me-1"
            ></i>

            Guardar cambios

          </button>

        </div>


      </div>

    </form>
  `;


  // =============================================
  // REGRESO A CASA
  // =============================================

  const activarRegresoCasa =
    document.getElementById(
      "editarActivarRegresoCasa"
    );

  const camposRegresoCasa =
    document.getElementById(
      "editarCamposRegresoCasa"
    );

  const inicioRegresoCasa =
    document.getElementById(
      "editarInicioRegresoCasa"
    );

  const finRegresoCasa =
    document.getElementById(
      "editarFinRegresoCasa"
    );

  const totalRegresoCasa =
    document.getElementById(
      "editarTotalRegresoCasa"
    );


  function calcularRegresoCasaEdicion() {

    if (
      !inicioRegresoCasa.value ||
      !finRegresoCasa.value
    ) {

      totalRegresoCasa.value =
        "0 min";

      return;
    }


    const [
      horaInicio,
      minutoInicio
    ] =
      inicioRegresoCasa.value
        .split(":")
        .map(Number);


    const [
      horaFin,
      minutoFin
    ] =
      finRegresoCasa.value
        .split(":")
        .map(Number);


    let minutosInicio =
      horaInicio * 60 +
      minutoInicio;

    let minutosFin =
      horaFin * 60 +
      minutoFin;


    // Cruza medianoche

    if (
      minutosFin <
      minutosInicio
    ) {

      minutosFin +=
        24 * 60;
    }


    const totalMinutos =
      minutosFin -
      minutosInicio;


    totalRegresoCasa.value =
      convertirMinutos(
        totalMinutos
      );
  }


  activarRegresoCasa.addEventListener(
    "change",
    () => {

      if (
        activarRegresoCasa.checked
      ) {

        camposRegresoCasa
          .classList.remove(
            "d-none"
          );

      } else {

        camposRegresoCasa
          .classList.add(
            "d-none"
          );

        inicioRegresoCasa.value =
          "";

        finRegresoCasa.value =
          "";

        totalRegresoCasa.value =
          "0 min";
      }
    }
  );


  inicioRegresoCasa.addEventListener(
    "change",
    calcularRegresoCasaEdicion
  );


  finRegresoCasa.addEventListener(
    "change",
    calcularRegresoCasaEdicion
  );


  // =============================================
  // CANCELAR EDICIÓN
  // =============================================

  const btnCancelarEdicion =
    document.getElementById(
      "btnCancelarEdicion"
    );


  btnCancelarEdicion.addEventListener(
    "click",
    () => {

      mostrarDetalle(
        servicioSeleccionado
      );

      btnEditarServicio
        .classList.remove(
          "d-none"
        );

      btnEliminarServicio
        .classList.remove(
          "d-none"
        );
    }
  );


  // =============================================
  // OCULTAR BOTONES DEL MODAL
  // =============================================

  btnEditarServicio
    .classList.add(
      "d-none"
    );

  btnEliminarServicio
    .classList.add(
      "d-none"
    );


  // =============================================
  // GUARDAR
  // =============================================

  const formulario =
    document.getElementById(
      "formEditarServicio"
    );


  formulario.addEventListener(
    "submit",
    guardarEdicionServicio
  );
}


// =============================================
// GUARDAR EDICIÓN
// =============================================

async function guardarEdicionServicio(
  event
) {

  event.preventDefault();


  if (!servicioSeleccionado) {
    return;
  }


  const activarRegresoCasa =
    document.getElementById(
      "editarActivarRegresoCasa"
    );


  const datos = {

    fecha:
      document.getElementById(
        "editarFecha"
      ).value,

    codigoTienda:
      Number(
        document.getElementById(
          "editarCodigoTienda"
        ).value
      ),

    numeroTicket:
      document
        .getElementById(
          "editarTicket"
        )
        .value
        .trim(),

    numeroCaf:
      document
        .getElementById(
          "editarCaf"
        )
        .value
        .trim() || null,

    lugarSalida:
      document
        .getElementById(
          "editarLugarSalida"
        )
        .value
        .trim() || null,

    horaIngreso:
      document.getElementById(
        "editarIngreso"
      ).value || null,

    horaEgreso:
      document.getElementById(
        "editarEgreso"
      ).value || null,

    inicioViaje:
      document.getElementById(
        "editarInicioViaje"
      ).value || null,

    finViaje:
      document.getElementById(
        "editarFinViaje"
      ).value || null,

    totalKilometros:
      Number(
        document.getElementById(
          "editarKilometros"
        ).value
      ) || 0,

    inicioRegresoCasa:
      activarRegresoCasa.checked
        ? (
            document.getElementById(
              "editarInicioRegresoCasa"
            ).value || null
          )
        : null,

    finRegresoCasa:
      activarRegresoCasa.checked
        ? (
            document.getElementById(
              "editarFinRegresoCasa"
            ).value || null
          )
        : null,

    trabajoRealizado:
      document
        .getElementById(
          "editarTrabajo"
        )
        .value
        .trim()
  };


  // =============================================
  // VALIDACIONES
  // =============================================

  if (
    !datos.fecha ||
    !datos.codigoTienda ||
    !datos.numeroTicket ||
    !datos.trabajoRealizado
  ) {

    await Swal.fire({
      icon: "warning",
      title:
        "Campos obligatorios",
      text:
        "Completa la fecha, determinante, ticket y trabajo realizado.",
      confirmButtonText:
        "Aceptar"
    });

    return;
  }


  if (
    (
      datos.horaIngreso &&
      !datos.horaEgreso
    ) ||
    (
      !datos.horaIngreso &&
      datos.horaEgreso
    )
  ) {

    await Swal.fire({
      icon: "warning",
      title:
        "Horario de atención incompleto",
      text:
        "Debes ingresar tanto la hora de ingreso como la hora de egreso.",
      confirmButtonText:
        "Aceptar"
    });

    return;
  }


  if (
    (
      datos.inicioViaje &&
      !datos.finViaje
    ) ||
    (
      !datos.inicioViaje &&
      datos.finViaje
    )
  ) {

    await Swal.fire({
      icon: "warning",
      title:
        "Horario de viaje incompleto",
      text:
        "Debes ingresar tanto el inicio como el fin del viaje.",
      confirmButtonText:
        "Aceptar"
    });

    return;
  }


  if (
    activarRegresoCasa.checked &&
    (
      !datos.inicioRegresoCasa ||
      !datos.finRegresoCasa
    )
  ) {

    await Swal.fire({
      icon: "warning",
      title:
        "Regreso a casa incompleto",
      text:
        "Debes ingresar la hora de inicio y la hora de fin del regreso a casa.",
      confirmButtonText:
        "Aceptar"
    });

    return;
  }


  try {

    const formulario =
      document.getElementById(
        "formEditarServicio"
      );

    const botonGuardar =
      formulario.querySelector(
        'button[type="submit"]'
      );


    botonGuardar.disabled =
      true;

    botonGuardar.innerHTML = `

      <span
        class="spinner-border spinner-border-sm me-1"
      ></span>

      Guardando...
    `;


    const respuesta =
      await fetch(
        `${API_URL}/api/servicios/${servicioSeleccionado.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body:
            JSON.stringify(
              datos
            )
        }
      );


    const resultado =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        resultado.mensaje ||
        "No fue posible actualizar el servicio"
      );
    }


    // Actualizar servicio seleccionado

    servicioSeleccionado =
      resultado.servicio;


    // Actualizar arreglo local

    const indice =
      servicios.findIndex(
        (servicio) =>
          servicio.id ===
          servicioSeleccionado.id
      );


    if (indice !== -1) {

      servicios[indice] =
        servicioSeleccionado;
    }


    // Actualizar tabla

    aplicarFiltros();


    // Volver al detalle

    mostrarDetalle(
      servicioSeleccionado
    );


    // Mostrar botones nuevamente

    btnEditarServicio
      .classList.remove(
        "d-none"
      );

    btnEliminarServicio
      .classList.remove(
        "d-none"
      );


    await Swal.fire({
      icon: "success",
      title:
        "¡Servicio actualizado!",
      text:
        "Los cambios se guardaron correctamente.",
      confirmButtonText:
        "Aceptar",
      confirmButtonColor:
        "#0d6efd"
    });


  } catch (error) {

    console.error(
      "Error al editar servicio:",
      error
    );


    await Swal.fire({
      icon: "error",
      title:
        "No se pudo actualizar",
      text:
        error.message,
      confirmButtonText:
        "Aceptar",
      confirmButtonColor:
        "#dc3545"
    });


    const formulario =
      document.getElementById(
        "formEditarServicio"
      );


    if (formulario) {

      const botonGuardar =
        formulario.querySelector(
          'button[type="submit"]'
        );


      if (botonGuardar) {

        botonGuardar.disabled =
          false;

        botonGuardar.innerHTML = `

          <i
            class="bi bi-check-lg me-1"
          ></i>

          Guardar cambios
        `;
      }
    }
  }
}

// =============================================
// BOTÓN EDITAR
// =============================================

// =============================================
// BOTÓN EDITAR
// =============================================

btnEditarServicio.addEventListener(
  "click",
  () => {

    if (!servicioSeleccionado) {
      return;
    }


    mostrarFormularioEdicion(
      servicioSeleccionado
    );
  }
);


// =============================================
// ELIMINAR DESDE MODAL
// =============================================

btnEliminarServicio.addEventListener(
  "click",
  async () => {

    if (!servicioSeleccionado) {
      return;
    }


    await eliminarServicioIndividual(
      servicioSeleccionado
    );
  }
);


// =============================================
// ELIMINACIÓN INDIVIDUAL
// =============================================

async function eliminarServicioIndividual(
  servicio
) {

  const confirmacion =
    await Swal.fire({

      icon: "warning",

      title:
        "¿Eliminar servicio?",

      html: `
        ¿Deseas eliminar el servicio
        <strong>${servicio.numeroTicket}</strong>?
        <br><br>
        Esta acción no se puede deshacer.
      `,

      showCancelButton: true,

      confirmButtonText:
        "Sí, eliminar",

      cancelButtonText:
        "Cancelar",

      confirmButtonColor:
        "#dc3545",

      cancelButtonColor:
        "#6c757d",

      reverseButtons:
        true
    });


  if (
    !confirmacion.isConfirmed
  ) {

    return;
  }


  try {

    const respuesta =
      await fetch(
        `${API_URL}/api/servicios/${servicio.id}`,
        {
          method:
            "DELETE",

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      );


    const resultado =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        resultado.mensaje ||
        "No fue posible eliminar el servicio"
      );
    }


    // Quitar selección

    serviciosSeleccionados
      .delete(
        servicio.id
      );


    // Quitar del arreglo local

    servicios =
      servicios.filter(
        (item) =>
          item.id !==
          servicio.id
      );


    // Cerrar modal

    const modal =
      bootstrap.Modal
        .getInstance(
          modalDetalleServicio
        );


    if (modal) {

      modal.hide();
    }


    servicioSeleccionado =
      null;


    aplicarFiltros();


    await Swal.fire({

      icon:
        "success",

      title:
        "Servicio eliminado",

      text:
        "El servicio se eliminó correctamente.",

      confirmButtonText:
        "Aceptar",

      confirmButtonColor:
        "#0d6efd"
    });


  } catch (error) {

    console.error(
      "Error eliminando servicio:",
      error
    );


    await Swal.fire({

      icon:
        "error",

      title:
        "No se pudo eliminar",

      text:
        error.message,

      confirmButtonText:
        "Aceptar",

      confirmButtonColor:
        "#dc3545"
    });
  }
}


// =============================================
// ELIMINAR SELECCIONADOS
// =============================================

btnEliminarSeleccionados
  .addEventListener(
    "click",
    async () => {

      const ids =
        Array.from(
          serviciosSeleccionados
        );


      if (
        ids.length === 0
      ) {

        return;
      }


      const confirmacion =
        await Swal.fire({

          icon:
            "warning",

          title:
            "¿Eliminar servicios seleccionados?",

          html: `
            Vas a eliminar
            <strong>${ids.length}</strong>
            ${
              ids.length === 1
                ? "servicio"
                : "servicios"
            }.
            <br><br>
            Esta acción no se puede deshacer.
          `,

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, eliminar",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#dc3545",

          cancelButtonColor:
            "#6c757d",

          reverseButtons:
            true
        });


      if (
        !confirmacion.isConfirmed
      ) {

        return;
      }


      try {

        // Deshabilitar mientras elimina

        btnEliminarSeleccionados
          .disabled =
            true;


        const respuesta =
          await fetch(
            `${API_URL}/api/servicios/eliminar-multiples`,
            {
              method:
                "DELETE",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify({
                  ids
                })
            }
          );


        const resultado =
          await respuesta.json();


        if (!respuesta.ok) {

          throw new Error(
            resultado.mensaje ||
            "No fue posible eliminar los servicios"
          );
        }


        // =====================================
        // QUITAR SERVICIOS DEL ARREGLO LOCAL
        // =====================================

        const idsEliminados =
          new Set(ids);


        servicios =
          servicios.filter(
            (servicio) =>
              !idsEliminados.has(
                servicio.id
              )
          );


        // Limpiar selección

        serviciosSeleccionados
          .clear();


        // Actualizar tabla

        aplicarFiltros();


        await Swal.fire({

          icon:
            "success",

          title:
            "Servicios eliminados",

          text:
            resultado.mensaje ||
            "Los servicios seleccionados fueron eliminados correctamente.",

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "#0d6efd"
        });


      } catch (error) {

        console.error(
          "Error eliminando servicios:",
          error
        );


        await Swal.fire({

          icon:
            "error",

          title:
            "No se pudieron eliminar",

          text:
            error.message,

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "#dc3545"
        });


      } finally {

        // =====================================
        // CORRECCIÓN:
        // NO RECONSTRUIR EL BOTÓN
        // =====================================

        btnEliminarSeleccionados
          .disabled =
            serviciosSeleccionados
              .size === 0;


        contadorSeleccionados
          .textContent =
            String(
              serviciosSeleccionados
                .size
            );
      }
    }
  );


// =============================================
// EVENTOS DE FILTROS
// =============================================

selectMes.addEventListener(
  "change",
  aplicarFiltros
);

selectAnio.addEventListener(
  "change",
  aplicarFiltros
);

fechaExacta.addEventListener(
  "change",
  aplicarFiltros
);

fechaDesde.addEventListener(
  "change",
  aplicarFiltros
);

fechaHasta.addEventListener(
  "change",
  aplicarFiltros
);

buscarServicio.addEventListener(
  "input",
  aplicarFiltros
);


// =============================================
// LIMPIAR FILTROS
// =============================================

btnLimpiarFiltros.addEventListener(
  "click",
  () => {

    filtroMes.checked =
      true;


    buscarServicio.value =
      "";


    serviciosSeleccionados
      .clear();


    configurarFiltrosIniciales();

    actualizarTipoFiltro();
  }
);


// =============================================
// LIMPIAR MODAL AL CERRAR
// =============================================

modalDetalleServicio.addEventListener(
  "hidden.bs.modal",
  () => {

    servicioSeleccionado =
      null;


    contenidoDetalleServicio
      .innerHTML =
        "";
  }
);


// =============================================
// INICIAR
// =============================================

configurarFiltrosIniciales();

actualizarTipoFiltro();

cargarServicios();