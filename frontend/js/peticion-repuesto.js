const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

// ========================================
// ELEMENTOS
// ========================================

const nombreUsuario =
  document.getElementById("nombreUsuario");

const nombreTecnico =
  document.getElementById("nombreTecnico");

const bodegaTecnico =
  document.getElementById("bodegaTecnico");

const fechaSolicitud =
  document.getElementById("fechaSolicitud");

const btnMenu =
  document.getElementById("btnMenu");

const sidebar =
  document.getElementById("sidebar");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const menuAdministrarUsuarios =
  document.getElementById(
    "menuAdministrarUsuarios"
  );

const menuAdministrarRepuestos =
  document.getElementById(
    "menuAdministrarRepuestos"
  );

const buscarTicket =
  document.getElementById("buscarTicket");

const resultadosTickets =
  document.getElementById(
    "resultadosTickets"
  );

const determinante =
  document.getElementById("determinante");

const nombreTienda =
  document.getElementById("nombreTienda");

const formPeticionRepuesto =
  document.getElementById(
    "formPeticionRepuesto"
  );

const descripcion =
  document.getElementById("descripcion");

const buscarRepuesto =
  document.getElementById("buscarRepuesto");

const resultadosRepuestos =
  document.getElementById(
    "resultadosRepuestos"
  );

const numeroParte =
  document.getElementById("numeroParte");

const imagenRepuesto =
  document.getElementById("imagenRepuesto");

const sinImagen =
  document.getElementById("sinImagen");

// Elementos nuevos del HTML actualizado
const cantidadRepuesto =
  document.getElementById("cantidadRepuesto");

const btnAgregarRepuesto =
  document.getElementById("btnAgregarRepuesto");

const tablaRepuestosAgregados =
  document.getElementById(
    "tablaRepuestosAgregados"
  );

const cuerpoRepuestosAgregados =
  document.getElementById(
    "cuerpoRepuestosAgregados"
  );

const sinRepuestosAgregados =
  document.getElementById(
    "sinRepuestosAgregados"
  );


// ========================================
// VARIABLES
// ========================================

let servicioSeleccionado = null;

let repuestoSeleccionado = null;

// Aquí guardaremos todos los repuestos
let repuestosAgregados = [];


// ========================================
// VALIDAR SESIÓN
// ========================================

if (!token || !usuarioGuardado) {

  window.location.href =
    "./login.html";

} else {

  try {

    const usuario =
      JSON.parse(usuarioGuardado);

    nombreUsuario.textContent =
      usuario.nombre;

    nombreTecnico.value =
      usuario.nombre;

    bodegaTecnico.value =
      usuario.bodega || "";

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
      "Error leyendo usuario:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
      "./login.html";
  }
}


// ========================================
// FECHA ACTUAL
// ========================================

const hoy =
  new Date().toLocaleDateString(
    "en-CA",
    {
      timeZone: "America/Guatemala"
    }
  );

fechaSolicitud.value = hoy;


// ========================================
// MENÚ RESPONSIVE
// ========================================

if (btnMenu && sidebar) {

  btnMenu.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "visible"
      );
    }
  );
}


// ========================================
// CERRAR SESIÓN
// ========================================

if (btnCerrarSesion) {

  btnCerrarSesion.addEventListener(
    "click",
    () => {

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href =
        "./login.html";
    }
  );
}


// ========================================
// BUSCAR TICKET
// ========================================

let temporizadorTicket = null;

if (buscarTicket) {

  buscarTicket.addEventListener(
    "input",
    () => {

      clearTimeout(temporizadorTicket);

      const busqueda =
        buscarTicket.value.trim();

      servicioSeleccionado = null;

      determinante.value = "";
      nombreTienda.value = "";

      resultadosTickets.innerHTML = "";

      resultadosTickets.classList.add(
        "d-none"
      );

      if (busqueda.length < 2) {
        return;
      }

      temporizadorTicket =
        setTimeout(
          () => buscarTickets(busqueda),
          350
        );
    }
  );
}


// ========================================
// CONSULTAR TICKETS
// ========================================

async function buscarTickets(busqueda) {

  try {

    const respuesta =
      await fetch(
        `${API_URL}/api/repuestos/buscar-ticket?q=${encodeURIComponent(busqueda)}`,
        {
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
        "No fue posible buscar el ticket"
      );
    }

    mostrarResultadosTickets(
      resultado.tickets || []
    );

  } catch (error) {

    console.error(
      "Error buscando tickets:",
      error
    );

    resultadosTickets.innerHTML = `
      <div
        class="list-group-item text-danger"
      >
        No fue posible buscar tickets.
      </div>
    `;

    resultadosTickets.classList.remove(
      "d-none"
    );
  }
}


// ========================================
// MOSTRAR TICKETS
// ========================================

function mostrarResultadosTickets(tickets) {

  resultadosTickets.innerHTML = "";

  if (tickets.length === 0) {

    resultadosTickets.innerHTML = `
      <div
        class="list-group-item text-secondary"
      >
        No se encontraron tickets.
      </div>
    `;

    resultadosTickets.classList.remove(
      "d-none"
    );

    return;
  }

  tickets.forEach((ticket) => {

    const boton =
      document.createElement("button");

    boton.type = "button";

    boton.className =
      "list-group-item list-group-item-action";

    boton.innerHTML = `
      <div
        class="d-flex justify-content-between align-items-center"
      >
        <strong>
          ${ticket.numeroTicket}
        </strong>

        <small class="text-secondary">
          ${ticket.determinante}
        </small>
      </div>

      <div class="small text-secondary">
        ${ticket.nombreTienda}
      </div>
    `;

    boton.addEventListener(
      "click",
      () => {

        seleccionarTicket(ticket);
      }
    );

    resultadosTickets.appendChild(
      boton
    );
  });

  resultadosTickets.classList.remove(
    "d-none"
  );
}


// ========================================
// SELECCIONAR TICKET
// ========================================

function seleccionarTicket(ticket) {

  servicioSeleccionado = ticket;

  buscarTicket.value =
    ticket.numeroTicket;

  determinante.value =
    ticket.determinante;

  nombreTienda.value =
    ticket.nombreTienda;

  resultadosTickets.innerHTML = "";

  resultadosTickets.classList.add(
    "d-none"
  );
}


// ========================================
// CERRAR RESULTADOS TICKET
// ========================================

document.addEventListener(
  "click",
  (event) => {

    if (
      buscarTicket &&
      resultadosTickets &&
      !buscarTicket.contains(event.target) &&
      !resultadosTickets.contains(event.target)
    ) {

      resultadosTickets.classList.add(
        "d-none"
      );
    }
  }
);


// ========================================
// BUSCAR REPUESTO
// ========================================

let temporizadorRepuesto = null;

if (buscarRepuesto) {

  buscarRepuesto.addEventListener(
    "input",
    () => {

      clearTimeout(
        temporizadorRepuesto
      );

      const busqueda =
        buscarRepuesto.value.trim();

      repuestoSeleccionado = null;

      numeroParte.value = "";

      ocultarImagenRepuesto();

      resultadosRepuestos.innerHTML = "";

      resultadosRepuestos.classList.add(
        "d-none"
      );

      if (busqueda.length < 2) {
        return;
      }

      temporizadorRepuesto =
        setTimeout(
          () => buscarRepuestos(busqueda),
          350
        );
    }
  );
}


// ========================================
// CONSULTAR REPUESTOS
// ========================================

async function buscarRepuestos(busqueda) {

  try {

    const respuesta =
      await fetch(
        `${API_URL}/api/repuestos/buscar?q=${encodeURIComponent(busqueda)}`,
        {
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
        "No fue posible buscar repuestos"
      );
    }

    mostrarResultadosRepuestos(
      resultado.repuestos || []
    );

  } catch (error) {

    console.error(
      "Error buscando repuestos:",
      error
    );

    resultadosRepuestos.innerHTML = `
      <div
        class="list-group-item text-danger"
      >
        No fue posible buscar repuestos.
      </div>
    `;

    resultadosRepuestos.classList.remove(
      "d-none"
    );
  }
}


// ========================================
// MOSTRAR REPUESTOS
// ========================================

function mostrarResultadosRepuestos(
  repuestos
) {

  resultadosRepuestos.innerHTML = "";

  if (repuestos.length === 0) {

    resultadosRepuestos.innerHTML = `
      <div
        class="list-group-item text-secondary"
      >
        No se encontraron repuestos.
      </div>
    `;

    resultadosRepuestos.classList.remove(
      "d-none"
    );

    return;
  }

  repuestos.forEach((repuesto) => {

    const boton =
      document.createElement("button");

    boton.type = "button";

    boton.className =
      "list-group-item list-group-item-action";

    boton.innerHTML = `
      <div
        class="d-flex justify-content-between align-items-center gap-3"
      >

        <strong>
          ${repuesto.nombre}
        </strong>

        <small class="text-secondary">
          ${repuesto.numeroParte}
        </small>

      </div>

      ${
        repuesto.tipoEquipo
          ? `
              <div
                class="small text-secondary"
              >
                ${repuesto.tipoEquipo}
              </div>
            `
          : ""
      }
    `;

    boton.addEventListener(
      "click",
      () => {

        seleccionarRepuesto(
          repuesto
        );
      }
    );

    resultadosRepuestos.appendChild(
      boton
    );
  });

  resultadosRepuestos.classList.remove(
    "d-none"
  );
}


// ========================================
// SELECCIONAR REPUESTO
// ========================================

function seleccionarRepuesto(repuesto) {

  repuestoSeleccionado = repuesto;

  buscarRepuesto.value =
    repuesto.nombre;

  numeroParte.value =
    repuesto.numeroParte;

  mostrarImagenRepuesto(
    repuesto.imagenUrl
  );

  if (cantidadRepuesto) {
    cantidadRepuesto.value = 1;
  }

  resultadosRepuestos.innerHTML = "";

  resultadosRepuestos.classList.add(
    "d-none"
  );
}


// ========================================
// CONVERTIR URL GOOGLE DRIVE
// ========================================

function convertirUrlDrive(url) {

  if (!url) {
    return "";
  }

  const texto = url.trim();

  let idArchivo = null;

  const coincidenciaFile =
    texto.match(
      /\/file\/d\/([^/]+)/
    );

  if (coincidenciaFile) {

    idArchivo =
      coincidenciaFile[1];
  }

  if (!idArchivo) {

    try {

      const urlObjeto =
        new URL(texto);

      idArchivo =
        urlObjeto.searchParams.get("id");

    } catch (error) {

      return texto;
    }
  }

  if (!idArchivo) {
    return texto;
  }

  return (
    "https://drive.google.com/thumbnail" +
    `?id=${idArchivo}&sz=w1000`
  );
}


// ========================================
// MOSTRAR IMAGEN
// ========================================

function mostrarImagenRepuesto(imagenUrl) {

  if (!imagenUrl) {

    imagenRepuesto.removeAttribute(
      "src"
    );

    imagenRepuesto.classList.add(
      "d-none"
    );

    sinImagen.innerHTML = `
      <i
        class="bi bi-image"
        style="font-size: 2rem;"
      ></i>

      <div>
        Este repuesto todavía no tiene
        una imagen registrada.
      </div>
    `;

    sinImagen.classList.remove(
      "d-none"
    );

    return;
  }

  const urlImagen =
    convertirUrlDrive(
      imagenUrl
    );

  imagenRepuesto.classList.add(
    "d-none"
  );

  sinImagen.innerHTML = `
    <div
      class="spinner-border spinner-border-sm"
      role="status"
    ></div>

    <div class="mt-2">
      Cargando imagen...
    </div>
  `;

  sinImagen.classList.remove(
    "d-none"
  );

  imagenRepuesto.onload = () => {

    sinImagen.classList.add(
      "d-none"
    );

    imagenRepuesto.classList.remove(
      "d-none"
    );
  };

  imagenRepuesto.onerror = () => {

    imagenRepuesto.classList.add(
      "d-none"
    );

    sinImagen.innerHTML = `
      <i
        class="bi bi-exclamation-triangle"
        style="font-size: 2rem;"
      ></i>

      <div class="mt-2">
        No fue posible cargar
        la imagen del repuesto.
      </div>
    `;

    sinImagen.classList.remove(
      "d-none"
    );
  };

  imagenRepuesto.src =
    urlImagen;
}


// ========================================
// OCULTAR IMAGEN
// ========================================

function ocultarImagenRepuesto() {

  imagenRepuesto.removeAttribute(
    "src"
  );

  imagenRepuesto.classList.add(
    "d-none"
  );

  sinImagen.innerHTML = `
    <i
      class="bi bi-image"
      style="font-size: 2rem;"
    ></i>

    <div>
      Selecciona un repuesto
      para visualizar su imagen.
    </div>
  `;

  sinImagen.classList.remove(
    "d-none"
  );
}


// ========================================
// CERRAR RESULTADOS REPUESTOS
// ========================================

document.addEventListener(
  "click",
  (event) => {

    if (
      buscarRepuesto &&
      resultadosRepuestos &&
      !buscarRepuesto.contains(event.target) &&
      !resultadosRepuestos.contains(event.target)
    ) {

      resultadosRepuestos.classList.add(
        "d-none"
      );
    }
  }
);


// ========================================
// AGREGAR REPUESTO A LA SOLICITUD
// ========================================

if (btnAgregarRepuesto) {

  btnAgregarRepuesto.addEventListener(
    "click",
    async () => {

      if (!repuestoSeleccionado) {

        await Swal.fire({
          icon: "warning",
          title: "Selecciona un repuesto",
          text:
            "Debes seleccionar un repuesto del catálogo antes de agregarlo.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#ffc107"
        });

        return;
      }

      const cantidad =
        parseInt(
          cantidadRepuesto?.value || "1",
          10
        );

      if (
        Number.isNaN(cantidad) ||
        cantidad < 1
      ) {

        await Swal.fire({
          icon: "warning",
          title: "Cantidad no válida",
          text:
            "La cantidad debe ser mayor o igual a 1.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#ffc107"
        });

        return;
      }

      // Buscar si ya fue agregado
      const existente =
        repuestosAgregados.find(
          (item) =>
            item.id ===
            repuestoSeleccionado.id
        );

      if (existente) {

        // Si ya existe aumentamos cantidad
        existente.cantidad += cantidad;

      } else {

        // Si no existe lo agregamos
        repuestosAgregados.push({
          id:
            repuestoSeleccionado.id,

          nombre:
            repuestoSeleccionado.nombre,

          numeroParte:
            repuestoSeleccionado.numeroParte,

          imagenUrl:
            repuestoSeleccionado.imagenUrl ||
            null,

          cantidad
        });
      }

      renderizarRepuestosAgregados();

      limpiarSeleccionRepuesto();
    }
  );
}


// ========================================
// LIMPIAR SELECCIÓN ACTUAL
// ========================================

function limpiarSeleccionRepuesto() {

  repuestoSeleccionado = null;

  buscarRepuesto.value = "";

  numeroParte.value = "";

  if (cantidadRepuesto) {
    cantidadRepuesto.value = 1;
  }

  resultadosRepuestos.innerHTML = "";

  resultadosRepuestos.classList.add(
    "d-none"
  );

  ocultarImagenRepuesto();

  buscarRepuesto.focus();
}


// ========================================
// RENDERIZAR REPUESTOS AGREGADOS
// ========================================

function renderizarRepuestosAgregados() {

  if (!cuerpoRepuestosAgregados) {
    return;
  }

  cuerpoRepuestosAgregados.innerHTML = "";

  if (repuestosAgregados.length === 0) {

    if (tablaRepuestosAgregados) {
      tablaRepuestosAgregados
        .classList.add("d-none");
    }

    if (sinRepuestosAgregados) {
      sinRepuestosAgregados
        .classList.remove("d-none");
    }

    return;
  }

  if (tablaRepuestosAgregados) {
    tablaRepuestosAgregados
      .classList.remove("d-none");
  }

  if (sinRepuestosAgregados) {
    sinRepuestosAgregados
      .classList.add("d-none");
  }

  repuestosAgregados.forEach(
    (repuesto, indice) => {

      const fila =
        document.createElement("tr");

      fila.innerHTML = `
        <td class="align-middle">
          ${indice + 1}
        </td>

        <td class="align-middle">
          <strong>
            ${repuesto.nombre}
          </strong>
        </td>

        <td class="align-middle">
          ${repuesto.numeroParte}
        </td>

        <td
          class="align-middle"
          style="min-width: 150px;"
        >
          <div
            class="input-group input-group-sm"
          >

            <button
              type="button"
              class="btn btn-outline-secondary"
              data-accion="restar"
              data-id="${repuesto.id}"
            >
              <i class="bi bi-dash"></i>
            </button>

            <input
              type="number"
              min="1"
              class="form-control text-center"
              value="${repuesto.cantidad}"
              data-accion="cantidad"
              data-id="${repuesto.id}"
            >

            <button
              type="button"
              class="btn btn-outline-secondary"
              data-accion="sumar"
              data-id="${repuesto.id}"
            >
              <i class="bi bi-plus"></i>
            </button>

          </div>
        </td>

        <td class="align-middle text-center">

          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            data-accion="eliminar"
            data-id="${repuesto.id}"
            title="Eliminar repuesto"
          >
            <i class="bi bi-trash"></i>
          </button>

        </td>
      `;

      cuerpoRepuestosAgregados
        .appendChild(fila);
    }
  );
}


// ========================================
// ACCIONES TABLA REPUESTOS
// ========================================

if (cuerpoRepuestosAgregados) {

  cuerpoRepuestosAgregados.addEventListener(
    "click",
    async (event) => {

      const boton =
        event.target.closest(
          "button[data-accion]"
        );

      if (!boton) {
        return;
      }

      const id =
        boton.dataset.id;

      const accion =
        boton.dataset.accion;

      const repuesto =
        repuestosAgregados.find(
          (item) => item.id === id
        );

      if (!repuesto) {
        return;
      }

      if (accion === "sumar") {

        repuesto.cantidad += 1;

        renderizarRepuestosAgregados();
        return;
      }

      if (accion === "restar") {

        if (repuesto.cantidad > 1) {

          repuesto.cantidad -= 1;

          renderizarRepuestosAgregados();

        } else {

          await eliminarRepuestoAgregado(
            id
          );
        }

        return;
      }

      if (accion === "eliminar") {

        await eliminarRepuestoAgregado(
          id
        );
      }
    }
  );


  // Cambiar cantidad escribiendo
  cuerpoRepuestosAgregados.addEventListener(
    "change",
    (event) => {

      const campo =
        event.target.closest(
          'input[data-accion="cantidad"]'
        );

      if (!campo) {
        return;
      }

      const id =
        campo.dataset.id;

      let cantidad =
        parseInt(
          campo.value,
          10
        );

      if (
        Number.isNaN(cantidad) ||
        cantidad < 1
      ) {
        cantidad = 1;
      }

      const repuesto =
        repuestosAgregados.find(
          (item) => item.id === id
        );

      if (!repuesto) {
        return;
      }

      repuesto.cantidad =
        cantidad;

      renderizarRepuestosAgregados();
    }
  );
}


// ========================================
// ELIMINAR REPUESTO AGREGADO
// ========================================

async function eliminarRepuestoAgregado(id) {

  const repuesto =
    repuestosAgregados.find(
      (item) => item.id === id
    );

  if (!repuesto) {
    return;
  }

  const resultado =
    await Swal.fire({
      icon: "question",
      title: "Eliminar repuesto",
      text:
        `¿Deseas eliminar ${repuesto.nombre} de la solicitud?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545"
    });

  if (!resultado.isConfirmed) {
    return;
  }

  repuestosAgregados =
    repuestosAgregados.filter(
      (item) => item.id !== id
    );

  renderizarRepuestosAgregados();
}


// ========================================
// GENERAR SOLICITUD
// ========================================

if (formPeticionRepuesto) {

  formPeticionRepuesto.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      // ========================================
      // VALIDAR TICKET
      // ========================================

      if (!servicioSeleccionado) {

        await Swal.fire({
          icon: "warning",
          title: "Selecciona un ticket",
          text:
            "Debes seleccionar un ticket de los resultados de búsqueda.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#ffc107"
        });

        return;
      }

      // ========================================
      // VALIDAR REPUESTOS AGREGADOS
      // ========================================

      if (
        repuestosAgregados.length === 0
      ) {

        await Swal.fire({
          icon: "warning",
          title: "Agrega al menos un repuesto",
          text:
            "Selecciona un repuesto y presiona + Agregar repuesto antes de generar la solicitud.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#ffc107"
        });

        return;
      }

      // ========================================
      // VALIDAR DESCRIPCIÓN
      // ========================================

      if (!descripcion.value.trim()) {

        await Swal.fire({
          icon: "warning",
          title: "Descripción requerida",
          text:
            "Ingresa una descripción para la solicitud.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#ffc107"
        });

        return;
      }

      // ========================================
      // ARMAR DATOS
      // ========================================

      const datos = {

        fechaSolicitud:
          fechaSolicitud.value,

        registroServicioId:
          servicioSeleccionado.id,

        repuestos:
          repuestosAgregados.map(
            (repuesto) => ({
              repuestoId:
                repuesto.id,

              cantidad:
                repuesto.cantidad
            })
          ),

        descripcion:
          descripcion.value.trim()
      };

      try {

        const respuesta =
          await fetch(
            `${API_URL}/api/repuestos/solicitudes`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify(datos)
            }
          );

        const resultado =
          await respuesta.json();

        if (!respuesta.ok) {

          throw new Error(
            resultado.mensaje ||
            "No fue posible generar la solicitud"
          );
        }

        await mostrarSolicitudGenerada(
          resultado.solicitud
        );

      } catch (error) {

        console.error(
          "Error generando solicitud:",
          error
        );

        await Swal.fire({
          icon: "error",
          title:
            "No se pudo generar la solicitud",
          text:
            error.message,
          confirmButtonText:
            "Aceptar",
          confirmButtonColor:
            "#dc3545"
        });
      }
    }
  );
}


// ========================================
// MOSTRAR SOLICITUD GENERADA
// ========================================

async function mostrarSolicitudGenerada(
  solicitud
) {

  // Construir listado de todos
  // los repuestos guardados
  const textoRepuestos =
    solicitud.detalles
      .map(
        (detalle, indice) => {

          return `${indice + 1}. ${detalle.repuesto.nombre}
   Número de parte / Modelo: ${detalle.repuesto.numeroParte}
   Cantidad: ${detalle.cantidad}`;
        }
      )
      .join("\n\n");

  const texto =
`PETICIÓN DE REPUESTOS

País: ${solicitud.pais}
Fecha: ${fechaSolicitud.value}

Número de ticket: ${solicitud.registroServicio.numeroTicket}
Determinante: ${solicitud.tienda.codigo}
Nombre de tienda: ${solicitud.tienda.nombre}

REPUESTOS SOLICITADOS

${textoRepuestos}

Soporte: ${solicitud.soporte}

Nombre: ${solicitud.usuario.nombre}
Bodega: ${solicitud.usuario.bodega || "-"}

Descripción:
${solicitud.descripcion}`;

  const resultado =
    await Swal.fire({

      icon: "success",

      title:
        "Solicitud generada",

      html: `
        <p class="mb-2">
          La solicitud fue guardada correctamente.
        </p>

        <textarea
          id="textoSolicitudGenerada"
          class="form-control"
          rows="18"
          readonly
        ></textarea>
      `,

      showCancelButton: true,

      confirmButtonText:
        "Copiar solicitud",

      cancelButtonText:
        "Cerrar",

      confirmButtonColor:
        "#0d6efd",

      width: 750,

      didOpen: () => {

        const campo =
          document.getElementById(
            "textoSolicitudGenerada"
          );

        campo.value =
          texto;
      }
    });

  if (resultado.isConfirmed) {

    try {

      await navigator.clipboard.writeText(
        texto
      );

      await Swal.fire({
        icon: "success",
        title: "Copiado",
        text:
          "La solicitud fue copiada al portapapeles.",
        timer: 1800,
        showConfirmButton: false
      });

    } catch (error) {

      await Swal.fire({
        icon: "warning",
        title:
          "No fue posible copiar automáticamente",
        text:
          "Puedes seleccionar y copiar manualmente el texto de la solicitud.",
        confirmButtonText:
          "Aceptar"
      });
    }
  }
}


// ========================================
// MOSTRAR ESTADO INICIAL DE TABLA
// ========================================

renderizarRepuestosAgregados();