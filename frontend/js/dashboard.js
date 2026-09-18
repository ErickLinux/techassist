let servicioSeleccionado = null;

// ==============================
// DATOS DE SESIÓN
// ==============================

const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");
const menuAdministrarUsuarios =
  document.getElementById(
    "menuAdministrarUsuarios"
  );

// ==============================
// ELEMENTOS DEL DOM
// ==============================

const nombreUsuario = document.getElementById("nombreUsuario");
const nombreBienvenida = document.getElementById("nombreBienvenida");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const btnMenu = document.getElementById("btnMenu");
const sidebar = document.getElementById("sidebar");

const cargandoServicios =
  document.getElementById("cargandoServicios");

const sinServicios =
  document.getElementById("sinServicios");

const tablaServiciosContenedor =
  document.getElementById("tablaServiciosContenedor");

const tablaServicios =
  document.getElementById("tablaServicios");
  
  const btnEliminarServicio =
  document.getElementById(
    "btnEliminarServicio"
  );

const btnEditarServicio =
  document.getElementById("btnEditarServicio");

const modalDetalleServicio =
  document.getElementById("modalDetalleServicio");

// ==============================
// VERIFICAR SESIÓN
// ==============================

if (!token || !usuarioGuardado) {

  window.location.href = "./login.html";

} else {

  try {

    const usuario = JSON.parse(usuarioGuardado);
    if (
  usuario.rol === "ADMIN" &&
  menuAdministrarUsuarios
) {
  menuAdministrarUsuarios.classList.remove(
    "d-none"
  );
}

    nombreUsuario.textContent = usuario.nombre;
    nombreBienvenida.textContent = usuario.nombre;

  } catch (error) {

    console.error(
      "No se pudieron leer los datos del usuario:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "./login.html";
  }
}

// ==============================
// CERRAR SESIÓN
// ==============================

btnCerrarSesion.addEventListener("click", () => {

  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "./login.html";
});

// ==============================
// MENÚ LATERAL
// ==============================

btnMenu.addEventListener("click", () => {

  sidebar.classList.toggle("visible");
});

// ==============================
// FUNCIONES DE FORMATO
// ==============================

function convertirMinutos(minutos) {

  const total = Number(minutos) || 0;

  const horas = Math.floor(total / 60);

  const minutosRestantes = total % 60;

  return `${horas} h ${minutosRestantes} min`;
}


function formatearFecha(fecha) {

  if (!fecha) {
    return "No registrada";
  }

  const fechaObjeto = new Date(fecha);

  return fechaObjeto.toLocaleDateString(
    "es-GT",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );
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
      hour12: true
    }
  );
}


function obtenerFechaInput(fecha) {

  if (!fecha) {
    return "";
  }

  const valor = new Date(fecha);

  const anio = valor.getFullYear();

  const mes = String(
    valor.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    valor.getDate()
  ).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}


function obtenerHoraInput(fecha) {

  if (!fecha) {
    return "";
  }

  const valor = new Date(fecha);

  const horas = String(
    valor.getHours()
  ).padStart(2, "0");

  const minutos = String(
    valor.getMinutes()
  ).padStart(2, "0");

  return `${horas}:${minutos}`;
}

// ==============================
// CARGAR SERVICIOS
// ==============================

async function cargarServicios() {

  tablaServicios.innerHTML = "";

  sinServicios.classList.add("d-none");

  tablaServiciosContenedor.classList.add(
    "d-none"
  );

  cargandoServicios.classList.remove(
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

    // Token vencido o inválido
    if (
      respuesta.status === 401 ||
      respuesta.status === 403
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href = "./login.html";

      return;
    }

    const datos = await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        datos.mensaje ||
        "No fue posible consultar los servicios"
      );
    }

    cargandoServicios.classList.add(
      "d-none"
    );

    // No hay servicios
    if (
      !datos.servicios ||
      datos.servicios.length === 0
    ) {

      sinServicios.classList.remove(
        "d-none"
      );

      return;
    }

    // Crear filas
    datos.servicios.forEach((servicio) => {

      const fila =
        document.createElement("tr");

      fila.innerHTML = `
        <td>
          ${formatearFecha(servicio.fecha)}
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
            class="btn btn-sm btn-outline-primary btn-ver-servicio"
            data-id="${servicio.id}"
          >

            <i class="bi bi-eye"></i>

            Ver

          </button>

        </td>
      `;

      tablaServicios.appendChild(fila);
    });

    tablaServiciosContenedor.classList.remove(
      "d-none"
    );

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
      <i class="bi bi-exclamation-circle"></i>

      <p>
        ${error.message}
      </p>
    `;
  }
}

// ==============================
// EVENTO BOTÓN VER
// ==============================

tablaServicios.addEventListener(
  "click",
  (event) => {

    const boton =
      event.target.closest(
        ".btn-ver-servicio"
      );

    if (!boton) {
      return;
    }

    const idServicio =
      boton.dataset.id;

    console.log(
      "Servicio seleccionado:",
      idServicio
    );

    verDetalleServicio(
      idServicio
    );
  }
);

// ==============================
// VER DETALLE DEL SERVICIO
// ==============================

async function verDetalleServicio(id) {

  const contenido =
    document.getElementById(
      "contenidoDetalleServicio"
    );

  const cargando =
    document.getElementById(
      "cargandoDetalle"
    );

  const modal =
    bootstrap.Modal.getOrCreateInstance(
      modalDetalleServicio
    );

  contenido.innerHTML = "";

  cargando.classList.remove(
    "d-none"
  );

  btnEditarServicio.classList.remove(
    "d-none"
  );

  btnEliminarServicio.classList.remove(
    "d-none"
  );

  modal.show();


  try {

    const respuesta = await fetch(
      `${API_URL}/api/servicios/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    if (
      respuesta.status === 401 ||
      respuesta.status === 403
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

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


    const servicio =
      datos.servicio;


    servicioSeleccionado =
      servicio;


    contenido.innerHTML = `
      <div class="row g-4">


        <!-- Técnico -->

        <div class="col-md-6">

          <label class="text-secondary small">
            Técnico
          </label>

          <div class="fw-semibold">
            ${servicio.usuario.nombre}
          </div>

        </div>


        <!-- Fecha -->

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


        <!-- Ticket -->

        <div class="col-md-6">

          <label class="text-secondary small">
            Ticket / INC
          </label>

          <div class="fw-semibold">
            ${servicio.numeroTicket}
          </div>

        </div>


        <!-- CAF -->

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


        <!-- Lugar de salida -->

        <div class="col-md-6">

          <label class="text-secondary small">
            Lugar de salida
          </label>

          <div class="fw-semibold">
            ${
              servicio.lugarSalida ||
              "No registrado"
            }
          </div>

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- Código tienda -->

        <div class="col-md-4">

          <label class="text-secondary small">
            Código tienda
          </label>

          <div class="fw-semibold">
            ${servicio.tienda.codigo}
          </div>

        </div>


        <!-- Tienda -->

        <div class="col-md-8">

          <label class="text-secondary small">
            Tienda
          </label>

          <div class="fw-semibold">
            ${servicio.tienda.nombre}
          </div>

        </div>


        <!-- Departamento -->

        <div class="col-md-6">

          <label class="text-secondary small">
            Departamento
          </label>

          <div class="fw-semibold">
            ${servicio.tienda.departamento}
          </div>

        </div>


        <!-- Municipio -->

        <div class="col-md-6">

          <label class="text-secondary small">
            Municipio
          </label>

          <div class="fw-semibold">
            ${servicio.tienda.municipio}
          </div>

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- Atención -->

        <div class="col-md-4">

          <label class="text-secondary small">
            Hora ingreso
          </label>

          <div class="fw-semibold">
            ${formatearHora(
              servicio.horaIngreso
            )}
          </div>

        </div>


        <div class="col-md-4">

          <label class="text-secondary small">
            Hora egreso
          </label>

          <div class="fw-semibold">
            ${formatearHora(
              servicio.horaEgreso
            )}
          </div>

        </div>


        <div class="col-md-4">

          <label class="text-secondary small">
            Total atención
          </label>

          <div class="fw-semibold">
            ${convertirMinutos(
              servicio.totalMinutosAtencion
            )}
          </div>

        </div>


        <!-- Viaje -->

        <div class="col-md-4">

          <label class="text-secondary small">
            Inicio viaje
          </label>

          <div class="fw-semibold">
            ${formatearHora(
              servicio.inicioViaje
            )}
          </div>

        </div>


        <div class="col-md-4">

          <label class="text-secondary small">
            Fin viaje
          </label>

          <div class="fw-semibold">
            ${formatearHora(
              servicio.finViaje
            )}
          </div>

        </div>


        <div class="col-md-4">

          <label class="text-secondary small">
            Total viaje
          </label>

          <div class="fw-semibold">
            ${convertirMinutos(
              servicio.totalMinutosViaje
            )}
          </div>

        </div>


        <!-- Kilómetros -->

        <div class="col-md-4">

          <label class="text-secondary small">
            Kilómetros
          </label>

          <div class="fw-semibold">
            ${servicio.totalKilometros} km
          </div>

        </div>


        ${
          servicio.inicioRegresoCasa &&
          servicio.finRegresoCasa
            ? `

              <div class="col-12">
                <hr>
              </div>


              <div class="col-12">

                <h6 class="fw-bold mb-0">
                  <i class="bi bi-house-door me-1"></i>
                  Regreso a casa
                </h6>

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


        <!-- Trabajo realizado -->

        <div class="col-12">

          <label class="text-secondary small">
            Trabajo realizado / Justificación
          </label>

          <div
            class="border rounded p-3 bg-light mt-1"
          >
            ${servicio.trabajoRealizado}
          </div>

        </div>


      </div>
    `;


  } catch (error) {

    console.error(
      "Error consultando detalle:",
      error
    );


    contenido.innerHTML = `
      <div class="alert alert-danger">
        ${error.message}
      </div>
    `;


  } finally {

    cargando.classList.add(
      "d-none"
    );
  }
}

// ==============================
// BOTÓN EDITAR
// ==============================

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

// ==============================
// MOSTRAR FORMULARIO DE EDICIÓN
// ==============================

function mostrarFormularioEdicion(
  servicio
) {

  const contenido =
    document.getElementById(
      "contenidoDetalleServicio"
    );


  const tieneRegresoCasa =
    Boolean(
      servicio.inicioRegresoCasa ||
      servicio.finRegresoCasa
    );


  contenido.innerHTML = `
    <form id="formEditarServicio">

      <div class="row g-3">


        <!-- Fecha -->

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


        <!-- Código tienda -->

        <div class="col-md-6">

          <label
            for="editarCodigoTienda"
            class="form-label"
          >
            Código tienda
          </label>

          <input
            type="number"
            id="editarCodigoTienda"
            class="form-control"
            value="${servicio.tienda.codigo}"
            required
          >

        </div>


        <!-- Ticket -->

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
            value="${servicio.numeroTicket}"
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


        <!-- Lugar de salida -->

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


        <!-- Atención -->

        <div class="col-12">

          <h6 class="fw-bold mb-0">
            <i class="bi bi-clock me-1"></i>
            Atención
          </h6>

        </div>


        <!-- Hora ingreso -->

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


        <!-- Hora egreso -->

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


        <!-- Viaje -->

        <div class="col-12">

          <h6 class="fw-bold mb-0">
            <i class="bi bi-car-front me-1"></i>
            Viaje
          </h6>

        </div>


        <!-- Inicio viaje -->

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


        <!-- Fin viaje -->

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


        <!-- Kilómetros -->

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
              servicio.totalKilometros || 0
            }"
          >

        </div>


        <div class="col-12">
          <hr>
        </div>


        <!-- Regreso a casa -->

        <div class="col-12">

          <div class="form-check form-switch">

            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="editarActivarRegresoCasa"
              ${tieneRegresoCasa ? "checked" : ""}
            >

            <label
              class="form-check-label fw-semibold"
              for="editarActivarRegresoCasa"
            >
              Agregar viaje de regreso a casa
            </label>

          </div>

          <div class="form-text">
            Activa esta opción cuando sea necesario
            registrar el viaje de regreso a casa.
          </div>

        </div>


        <!-- Campos regreso -->

        <div
          class="col-12 ${
            tieneRegresoCasa
              ? ""
              : "d-none"
          }"
          id="editarCamposRegresoCasa"
        >

          <div class="row g-3 mt-1">


            <!-- Inicio regreso -->

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


            <!-- Fin regreso -->

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


            <!-- Total regreso -->

            <div class="col-md-4">

              <label
                for="editarTotalRegresoCasa"
                class="form-label"
              >
                Total regreso a casa
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


        <!-- Trabajo realizado -->

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
          >${servicio.trabajoRealizado}</textarea>

        </div>


        <!-- Guardar -->

        <div class="col-12 text-end">

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


  // ==============================
  // ELEMENTOS REGRESO A CASA
  // ==============================

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


  // ==============================
  // CALCULAR REGRESO
  // ==============================

  function calcularRegresoCasaEdicion() {

    if (
      !inicioRegresoCasa.value ||
      !finRegresoCasa.value
    ) {

      totalRegresoCasa.value =
        "0 h 0 min";

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


    // Si cruza medianoche
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


  // ==============================
  // EVENTO SWITCH
  // ==============================

  activarRegresoCasa.addEventListener(
    "change",
    () => {

      if (
        activarRegresoCasa.checked
      ) {

        camposRegresoCasa.classList.remove(
          "d-none"
        );

      } else {

        camposRegresoCasa.classList.add(
          "d-none"
        );


        inicioRegresoCasa.value =
          "";

        finRegresoCasa.value =
          "";

        totalRegresoCasa.value =
          "0 h 0 min";
      }
    }
  );


  // ==============================
  // RECALCULAR AL CAMBIAR HORAS
  // ==============================

  inicioRegresoCasa.addEventListener(
    "change",
    calcularRegresoCasaEdicion
  );


  finRegresoCasa.addEventListener(
    "change",
    calcularRegresoCasaEdicion
  );


  // Ocultar botones mientras editamos

  btnEditarServicio.classList.add(
    "d-none"
  );

  btnEliminarServicio.classList.add(
    "d-none"
  );


  // Evento guardar

  const formulario =
    document.getElementById(
      "formEditarServicio"
    );


  formulario.addEventListener(
    "submit",
    guardarEdicionServicio
  );
}

// ==============================
// GUARDAR EDICIÓN
// ==============================

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
        ? document.getElementById(
            "editarInicioRegresoCasa"
          ).value || null
        : null,


    finRegresoCasa:
      activarRegresoCasa.checked
        ? document.getElementById(
            "editarFinRegresoCasa"
          ).value || null
        : null,


    trabajoRealizado:
      document
        .getElementById(
          "editarTrabajo"
        )
        .value
        .trim()
  };


  // ==============================
  // VALIDACIONES
  // ==============================

  if (
    activarRegresoCasa.checked &&
    (
      !datos.inicioRegresoCasa ||
      !datos.finRegresoCasa
    )
  ) {

    alert(
      "Si activas regreso a casa debes ingresar la hora de inicio y la hora de fin."
    );

    return;
  }


  if (
    (datos.horaIngreso &&
      !datos.horaEgreso) ||
    (!datos.horaIngreso &&
      datos.horaEgreso)
  ) {

    alert(
      "Para registrar atención debes ingresar tanto la hora de ingreso como la hora de egreso."
    );

    return;
  }


  if (
    (datos.inicioViaje &&
      !datos.finViaje) ||
    (!datos.inicioViaje &&
      datos.finViaje)
  ) {

    alert(
      "Para registrar un viaje debes ingresar tanto la hora de inicio como la hora de fin."
    );

    return;
  }


  try {

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


    Swal.fire({
  icon: "error",
  title: "No se pudo eliminar",
  text: error.message,
  confirmButtonText: "Aceptar",
  confirmButtonColor: "#dc3545"
});


    servicioSeleccionado =
      resultado.servicio;


    btnEditarServicio.classList.remove(
      "d-none"
    );

    btnEliminarServicio.classList.remove(
      "d-none"
    );


    // Actualizar tabla
    await cargarServicios();


    // Mostrar nuevamente
    // el servicio actualizado
    await verDetalleServicio(
      resultado.servicio.id
    );


  } catch (error) {

    console.error(
      "Error al editar servicio:",
      error
    );


    Swal.fire({
  icon: "error",
  title: "No se pudo actualizar",
  text: error.message,
  confirmButtonText: "Aceptar",
  confirmButtonColor: "#dc3545"
});
  }
}

// ==============================
// AL CERRAR EL MODAL
// ==============================

modalDetalleServicio.addEventListener(
  "hidden.bs.modal",
  () => {

    btnEditarServicio.classList.remove(
      "d-none"
    );

    servicioSeleccionado = null;
  }
);

// ==============================
// INICIAR DASHBOARD
// ==============================

cargarServicios();


async function eliminarServicioSeleccionado() {

  if (!servicioSeleccionado) {
    return;
  }

  // ==============================
  // CONFIRMAR ELIMINACIÓN
  // ==============================

  const resultadoConfirmacion = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar servicio?",
    html: `
      ¿Estás seguro de eliminar el servicio
      <strong>${servicioSeleccionado.numeroTicket}</strong>?
      <br><br>
      Esta acción no se puede deshacer.
    `,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    reverseButtons: true
  });

  if (!resultadoConfirmacion.isConfirmed) {
    return;
  }

  try {

    btnEliminarServicio.disabled = true;

    btnEliminarServicio.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-1"
      ></span>
      Eliminando...
    `;

    const respuesta = await fetch(
      `${API_URL}/api/servicios/${servicioSeleccionado.id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.mensaje ||
        "No fue posible eliminar el servicio"
      );
    }

    // Cerrar modal de detalle
    const modal =
      bootstrap.Modal.getInstance(
        modalDetalleServicio
      );

    if (modal) {
      modal.hide();
    }

    servicioSeleccionado = null;

    await cargarServicios();

    // Mensaje moderno de éxito
    await Swal.fire({
      icon: "success",
      title: "Servicio eliminado",
      text: "El servicio se eliminó correctamente.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#0d6efd"
    });

  } catch (error) {

    console.error(
      "Error al eliminar servicio:",
      error
    );

    await Swal.fire({
      icon: "error",
      title: "No se pudo eliminar",
      text: error.message,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#dc3545"
    });

  } finally {

    btnEliminarServicio.disabled = false;

    btnEliminarServicio.innerHTML = `
      <i class="bi bi-trash me-1"></i>
      Eliminar
    `;
  }
}
btnEliminarServicio.addEventListener(
  "click",
  eliminarServicioSeleccionado
);