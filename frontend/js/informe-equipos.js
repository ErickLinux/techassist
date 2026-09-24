// ========================================
// INFORME DE EQUIPOS - TECHASSIST
// ========================================


// ========================================
// ELEMENTOS GENERALES
// ========================================

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

const nombreUsuarioTop =
  document.getElementById(
    "nombreUsuarioTop"
  );

const rolUsuarioTop =
  document.getElementById(
    "rolUsuarioTop"
  );

const menuAdminRepuestos =
  document.getElementById(
    "menuAdminRepuestos"
  );

const menuAdminUsuarios =
  document.getElementById(
    "menuAdminUsuarios"
  );


// ========================================
// DATOS DEL INFORME
// ========================================

const fechaInforme =
  document.getElementById(
    "fechaInforme"
  );

const nombreTecnico =
  document.getElementById(
    "nombreTecnico"
  );

const bodegaTecnico =
  document.getElementById(
    "bodegaTecnico"
  );


// ========================================
// EQUIPO
// ========================================

const tipoEquipo =
  document.getElementById(
    "tipoEquipo"
  );

const contenedorOtroTipo =
  document.getElementById(
    "contenedorOtroTipo"
  );

const otroTipoEquipo =
  document.getElementById(
    "otroTipoEquipo"
  );

const fotoEquipo =
  document.getElementById(
    "fotoEquipo"
  );

const contenedorVistaFoto =
  document.getElementById(
    "contenedorVistaFoto"
  );

const vistaFoto =
  document.getElementById(
    "vistaFoto"
  );

const modeloEquipo =
  document.getElementById(
    "modeloEquipo"
  );

const serieEquipo =
  document.getElementById(
    "serieEquipo"
  );

const btnAgregarEquipo =
  document.getElementById(
    "btnAgregarEquipo"
  );


// ========================================
// TABLA EQUIPOS
// ========================================

const mensajeSinEquipos =
  document.getElementById(
    "mensajeSinEquipos"
  );

const contenedorTablaEquipos =
  document.getElementById(
    "contenedorTablaEquipos"
  );

const tablaEquipos =
  document.getElementById(
    "tablaEquipos"
  );

const badgeTotalEquipos =
  document.getElementById(
    "badgeTotalEquipos"
  );


// ========================================
// RESUMEN
// ========================================

const mensajeResumenVacio =
  document.getElementById(
    "mensajeResumenVacio"
  );

const contenedorResumen =
  document.getElementById(
    "contenedorResumen"
  );

const tablaResumen =
  document.getElementById(
    "tablaResumen"
  );

const totalEquipos =
  document.getElementById(
    "totalEquipos"
  );


// ========================================
// EVIDENCIAS
// ========================================

const fotoGuiaEnvio =
  document.getElementById(
    "fotoGuiaEnvio"
  );

const contenedorFotoGuia =
  document.getElementById(
    "contenedorFotoGuia"
  );

const vistaFotoGuia =
  document.getElementById(
    "vistaFotoGuia"
  );


const fotoGeneralEnvio =
  document.getElementById(
    "fotoGeneralEnvio"
  );

const contenedorFotoGeneral =
  document.getElementById(
    "contenedorFotoGeneral"
  );

const vistaFotoGeneral =
  document.getElementById(
    "vistaFotoGeneral"
  );


// ========================================
// PDF
// ========================================

const btnGenerarPDF =
  document.getElementById(
    "btnGenerarPDF"
  );


// ========================================
// VARIABLES
// ========================================

let equipos = [];

let fotoEquipoActual = "";

let fotoGuiaActual = "";

let fotoGeneralActual = "";


// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    verificarSesion();

    establecerFechaActual();

    renderizarEquipos();

    actualizarResumen();

  }
);


// ========================================
// MENÚ MÓVIL
// ========================================

if (btnMenu) {

  btnMenu.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "show"
      );

    }
  );

}


// ========================================
// VERIFICAR SESIÓN
// ========================================

function verificarSesion() {

  const token =
    localStorage.getItem(
      "token"
    );

  const usuarioTexto =
    localStorage.getItem(
      "usuario"
    );


  if (
    !token ||
    !usuarioTexto
  ) {

    window.location.href =
      "./login.html";

    return;
  }


  try {

    const usuario =
      JSON.parse(
        usuarioTexto
      );


    const nombre =
      obtenerNombreUsuario(
        usuario
      );


    const rol =
      usuario.rol ||
      usuario.role ||
      "TECNICO";


    const bodega =
      usuario.bodega ||
      usuario.codigoBodega ||
      usuario.bodegaCodigo ||
      "";


    nombreUsuarioTop.textContent =
      nombre;

    rolUsuarioTop.textContent =
      rol;


    nombreTecnico.value =
      nombre;

    bodegaTecnico.value =
      bodega;


    if (
      String(rol)
        .toUpperCase() ===
      "ADMIN"
    ) {

      if (menuAdminRepuestos) {

        menuAdminRepuestos
          .classList.remove(
            "d-none"
          );
      }


      if (menuAdminUsuarios) {

        menuAdminUsuarios
          .classList.remove(
            "d-none"
          );
      }

    }

  } catch (error) {

    console.error(
      "Error leyendo usuario:",
      error
    );

    cerrarSesion();

  }

}


// ========================================
// OBTENER NOMBRE
// ========================================

function obtenerNombreUsuario(
  usuario
) {

  if (!usuario) {
    return "Usuario";
  }


  if (usuario.nombreCompleto) {

    return usuario.nombreCompleto;
  }


  if (usuario.nombre) {

    return usuario.nombre;
  }


  if (usuario.username) {

    return usuario.username;
  }


  if (usuario.usuario) {

    return usuario.usuario;
  }


  return "Usuario";
}


// ========================================
// CERRAR SESIÓN
// ========================================

btnCerrarSesion.addEventListener(
  "click",
  async () => {

    const resultado =
      await Swal.fire({

        icon: "question",

        title:
          "¿Cerrar sesión?",

        text:
          "Se cerrará tu sesión actual.",

        showCancelButton: true,

        confirmButtonText:
          "Sí, cerrar sesión",

        cancelButtonText:
          "Cancelar"

      });


    if (
      resultado.isConfirmed
    ) {

      cerrarSesion();

    }

  }
);


function cerrarSesion() {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "usuario"
  );


  window.location.href =
    "./login.html";

}


// ========================================
// FECHA GUATEMALA
// ========================================

function establecerFechaActual() {

  const partes =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/Guatemala",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit"
      }
    ).formatToParts(
      new Date()
    );


  const valores = {};


  partes.forEach(
    parte => {

      if (
        parte.type !==
        "literal"
      ) {

        valores[parte.type] =
          parte.value;

      }

    }
  );


  fechaInforme.value =
    `${valores.year}-${valores.month}-${valores.day}`;

}


// ========================================
// OTRO TIPO DE EQUIPO
// ========================================

tipoEquipo.addEventListener(
  "change",
  () => {

    if (
      tipoEquipo.value ===
      "Otro"
    ) {

      contenedorOtroTipo
        .classList.remove(
          "d-none"
        );

      otroTipoEquipo.focus();

    } else {

      contenedorOtroTipo
        .classList.add(
          "d-none"
        );

      otroTipoEquipo.value =
        "";

    }

  }
);


// ========================================
// FOTO DEL EQUIPO
// ========================================

fotoEquipo.addEventListener(
  "change",
  () => {

    const archivo =
      fotoEquipo.files[0];


    if (!archivo) {

      limpiarFotoEquipo();

      return;
    }


    if (
      !archivo.type.startsWith(
        "image/"
      )
    ) {

      Swal.fire({

        icon: "warning",

        title:
          "Archivo no válido",

        text:
          "Selecciona una imagen."

      });


      fotoEquipo.value =
        "";

      limpiarFotoEquipo();

      return;
    }


    const lector =
      new FileReader();


    lector.onload =
      evento => {

        fotoEquipoActual =
          evento.target.result;


        vistaFoto.src =
          fotoEquipoActual;


        contenedorVistaFoto
          .classList.remove(
            "d-none"
          );

      };


    lector.readAsDataURL(
      archivo
    );

  }
);


// ========================================
// AGREGAR EQUIPO
// ========================================

btnAgregarEquipo.addEventListener(
  "click",
  async () => {

    let tipo =
      tipoEquipo.value.trim();


    if (!tipo) {

      await Swal.fire({

        icon: "warning",

        title:
          "Tipo de equipo requerido",

        text:
          "Selecciona el tipo de equipo."

      });

      return;
    }


    if (
      tipo ===
      "Otro"
    ) {

      tipo =
        otroTipoEquipo
          .value
          .trim();


      if (!tipo) {

        await Swal.fire({

          icon: "warning",

          title:
            "Especifica el equipo",

          text:
            "Indica qué tipo de equipo estás agregando."

        });

        otroTipoEquipo.focus();

        return;
      }

    }


    if (!fotoEquipoActual) {

      await Swal.fire({

        icon: "warning",

        title:
          "Fotografía requerida",

        text:
          "Toma o selecciona una fotografía del equipo."

      });

      return;
    }


    const nuevoEquipo = {

      id:
        generarId(),

      tipo:
        normalizarNombreTipo(
          tipo
        ),

      modelo:
        modeloEquipo
          .value
          .trim(),

      serie:
        serieEquipo
          .value
          .trim(),

      foto:
        fotoEquipoActual

    };


    equipos.push(
      nuevoEquipo
    );


    renderizarEquipos();

    actualizarResumen();

    limpiarFormularioEquipo();


    await Swal.fire({

      icon: "success",

      title:
        "Equipo agregado",

      text:
        `${nuevoEquipo.tipo} agregado correctamente.`,

      timer: 1200,

      showConfirmButton:
        false

    });

  }
);


// ========================================
// GENERAR ID
// ========================================

function generarId() {

  if (
    window.crypto &&
    crypto.randomUUID
  ) {

    return crypto.randomUUID();
  }


  return (
    Date.now().toString() +
    Math.random()
      .toString(16)
      .slice(2)
  );

}


// ========================================
// NORMALIZAR TIPO
// ========================================

function normalizarNombreTipo(
  texto
) {

  const limpio =
    texto
      .trim()
      .replace(
        /\s+/g,
        " "
      );


  if (!limpio) {
    return "";
  }


  return (
    limpio.charAt(0)
      .toUpperCase() +
    limpio.slice(1)
  );

}


// ========================================
// RENDERIZAR EQUIPOS
// ========================================

function renderizarEquipos() {

  tablaEquipos.innerHTML =
    "";


  if (
    equipos.length === 0
  ) {

    mensajeSinEquipos
      .classList.remove(
        "d-none"
      );

    contenedorTablaEquipos
      .classList.add(
        "d-none"
      );

    badgeTotalEquipos.textContent =
      "0 equipos";

    return;
  }


  mensajeSinEquipos
    .classList.add(
      "d-none"
    );

  contenedorTablaEquipos
    .classList.remove(
      "d-none"
    );


  equipos.forEach(
    (equipo, indice) => {

      const fila =
        document.createElement(
          "tr"
        );


      // NÚMERO

      const tdNumero =
        document.createElement(
          "td"
        );

      tdNumero.textContent =
        indice + 1;


      // FOTO

      const tdFoto =
        document.createElement(
          "td"
        );

      const imagen =
        document.createElement(
          "img"
        );

      imagen.src =
        equipo.foto;

      imagen.alt =
        equipo.tipo;

      imagen.className =
        "miniatura-equipo";

      tdFoto.appendChild(
        imagen
      );


      // TIPO

      const tdTipo =
        document.createElement(
          "td"
        );

      tdTipo.textContent =
        equipo.tipo;


      // MODELO

      const tdModelo =
        document.createElement(
          "td"
        );

      tdModelo.textContent =
        equipo.modelo ||
        "—";


      // SERIE

      const tdSerie =
        document.createElement(
          "td"
        );

      tdSerie.textContent =
        equipo.serie ||
        "—";


      // ACCIÓN

      const tdAccion =
        document.createElement(
          "td"
        );

      tdAccion.className =
        "text-center";


      const botonEliminar =
        document.createElement(
          "button"
        );

      botonEliminar.type =
        "button";

      botonEliminar.className =
        "btn btn-outline-danger btn-sm";

      botonEliminar.innerHTML =
        '<i class="bi bi-trash"></i>';

      botonEliminar.title =
        "Eliminar equipo";


      botonEliminar.addEventListener(
        "click",
        () => {

          eliminarEquipo(
            equipo.id
          );

        }
      );


      tdAccion.appendChild(
        botonEliminar
      );


      fila.appendChild(
        tdNumero
      );

      fila.appendChild(
        tdFoto
      );

      fila.appendChild(
        tdTipo
      );

      fila.appendChild(
        tdModelo
      );

      fila.appendChild(
        tdSerie
      );

      fila.appendChild(
        tdAccion
      );


      tablaEquipos.appendChild(
        fila
      );

    }
  );


  badgeTotalEquipos.textContent =
    `${equipos.length} ${
      equipos.length === 1
        ? "equipo"
        : "equipos"
    }`;

}


// ========================================
// ELIMINAR EQUIPO
// ========================================

async function eliminarEquipo(
  id
) {

  const equipo =
    equipos.find(
      item =>
        item.id === id
    );


  if (!equipo) {
    return;
  }


  const resultado =
    await Swal.fire({

      icon: "warning",

      title:
        "¿Eliminar equipo?",

      text:
        `Se eliminará ${equipo.tipo} del informe.`,

      showCancelButton:
        true,

      confirmButtonColor:
        "#dc3545",

      confirmButtonText:
        "Sí, eliminar",

      cancelButtonText:
        "Cancelar"

    });


  if (
    !resultado.isConfirmed
  ) {

    return;
  }


  equipos =
    equipos.filter(
      item =>
        item.id !== id
    );


  renderizarEquipos();

  actualizarResumen();

}


// ========================================
// RESUMEN AUTOMÁTICO
// ========================================

function actualizarResumen() {

  tablaResumen.innerHTML =
    "";


  if (
    equipos.length === 0
  ) {

    mensajeResumenVacio
      .classList.remove(
        "d-none"
      );

    contenedorResumen
      .classList.add(
        "d-none"
      );

    totalEquipos.textContent =
      "0";

    return;
  }


  mensajeResumenVacio
    .classList.add(
      "d-none"
    );

  contenedorResumen
    .classList.remove(
      "d-none"
    );


  const resumen = {};


  equipos.forEach(
    equipo => {

      const clave =
        equipo.tipo
          .trim()
          .toLowerCase();


      if (!resumen[clave]) {

        resumen[clave] = {

          nombre:
            equipo.tipo,

          cantidad:
            0

        };

      }


      resumen[clave].cantidad++;

    }
  );


  const tipos =
    Object.values(
      resumen
    );


  tipos.sort(
    (a, b) =>
      a.nombre.localeCompare(
        b.nombre,
        "es"
      )
  );


  tipos.forEach(
    item => {

      const fila =
        document.createElement(
          "tr"
        );


      const tdTipo =
        document.createElement(
          "td"
        );

      tdTipo.className =
        "resumen-cantidad";

      tdTipo.textContent =
        item.nombre;


      const tdCantidad =
        document.createElement(
          "td"
        );

      tdCantidad.className =
        "text-center resumen-cantidad";

      tdCantidad.textContent =
        item.cantidad;


      fila.appendChild(
        tdTipo
      );

      fila.appendChild(
        tdCantidad
      );


      tablaResumen.appendChild(
        fila
      );

    }
  );


  totalEquipos.textContent =
    equipos.length;

}


// ========================================
// LIMPIAR FORMULARIO DE EQUIPO
// ========================================

function limpiarFormularioEquipo() {

  tipoEquipo.value =
    "";

  otroTipoEquipo.value =
    "";

  contenedorOtroTipo
    .classList.add(
      "d-none"
    );


  modeloEquipo.value =
    "";

  serieEquipo.value =
    "";

  fotoEquipo.value =
    "";


  limpiarFotoEquipo();


  tipoEquipo.focus();

}


// ========================================
// LIMPIAR FOTO EQUIPO
// ========================================

function limpiarFotoEquipo() {

  fotoEquipoActual =
    "";

  vistaFoto.removeAttribute(
    "src"
  );

  contenedorVistaFoto
    .classList.add(
      "d-none"
    );

}


// ========================================
// FOTO GUÍA DE ENVÍO
// ========================================

fotoGuiaEnvio.addEventListener(
  "change",
  () => {

    procesarImagenEvidencia(
      fotoGuiaEnvio,
      vistaFotoGuia,
      contenedorFotoGuia,
      imagen => {

        fotoGuiaActual =
          imagen;

      }
    );

  }
);


// ========================================
// FOTO GENERAL DEL ENVÍO
// ========================================

fotoGeneralEnvio.addEventListener(
  "change",
  () => {

    procesarImagenEvidencia(
      fotoGeneralEnvio,
      vistaFotoGeneral,
      contenedorFotoGeneral,
      imagen => {

        fotoGeneralActual =
          imagen;

      }
    );

  }
);


// ========================================
// PROCESAR EVIDENCIA
// ========================================

function procesarImagenEvidencia(
  input,
  imagenVista,
  contenedor,
  callback
) {

  const archivo =
    input.files[0];


  if (!archivo) {

    imagenVista.removeAttribute(
      "src"
    );

    contenedor.classList.add(
      "d-none"
    );

    callback("");

    return;
  }


  if (
    !archivo.type.startsWith(
      "image/"
    )
  ) {

    Swal.fire({

      icon: "warning",

      title:
        "Archivo no válido",

      text:
        "Selecciona una imagen."

    });


    input.value =
      "";

    imagenVista.removeAttribute(
      "src"
    );

    contenedor.classList.add(
      "d-none"
    );

    callback("");

    return;
  }


  const lector =
    new FileReader();


  lector.onload =
    evento => {

      const imagen =
        evento.target.result;


      imagenVista.src =
        imagen;


      contenedor.classList.remove(
        "d-none"
      );


      callback(
        imagen
      );

    };


  lector.readAsDataURL(
    archivo
  );

}


// ========================================
// GENERAR PDF
// ========================================

btnGenerarPDF.addEventListener(
  "click",
  async () => {

    // =====================================
    // VALIDACIONES
    // =====================================

    if (!fechaInforme.value) {

      await Swal.fire({

        icon: "warning",

        title:
          "Fecha requerida",

        text:
          "Selecciona la fecha del informe."

      });

      return;
    }


    if (
      equipos.length === 0
    ) {

      await Swal.fire({

        icon: "warning",

        title:
          "No hay equipos",

        text:
          "Agrega al menos un equipo antes de generar el informe."

      });

      return;
    }


    if (!fotoGuiaActual) {

      await Swal.fire({

        icon: "warning",

        title:
          "Guía de envío requerida",

        text:
          "Agrega una fotografía de la guía de envío."

      });

      fotoGuiaEnvio.focus();

      return;
    }


    if (!fotoGeneralActual) {

      await Swal.fire({

        icon: "warning",

        title:
          "Fotografía general requerida",

        text:
          "Agrega una fotografía general de las cajas o equipos enviados."

      });

      fotoGeneralEnvio.focus();

      return;
    }


    // =====================================
    // PDF SERÁ EL SIGUIENTE PASO
    // =====================================

    await Swal.fire({

      icon: "success",

      title:
        "Informe listo",

      html: `
        <div class="text-start">

          <p>
            Los datos necesarios para generar
            el PDF están completos.
          </p>

          <hr>

          <p class="mb-1">
            <strong>Equipos:</strong>
            ${equipos.length}
          </p>

          <p class="mb-1">
            <strong>Guía de envío:</strong>
            Agregada
          </p>

          <p class="mb-0">
            <strong>Evidencia general:</strong>
            Agregada
          </p>

        </div>
      `,

      confirmButtonText:
        "Aceptar"

    });

  }
);