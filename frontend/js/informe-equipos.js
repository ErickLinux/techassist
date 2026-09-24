// ========================================
// INFORME DE EQUIPOS - TECHASSIST
// ========================================


// ========================================
// SESIÓN
// ========================================

const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");


// ========================================
// ELEMENTOS GENERALES
// ========================================

const nombreUsuario =
  document.getElementById("nombreUsuario");

const nombreTecnico =
  document.getElementById("nombreTecnico");

const bodegaTecnico =
  document.getElementById("bodegaTecnico");

const fechaInforme =
  document.getElementById("fechaInforme");

const btnMenu =
  document.getElementById("btnMenu");

const sidebar =
  document.getElementById("sidebar");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const menuAdministrarUsuarios =
  document.getElementById("menuAdministrarUsuarios");

const menuAdministrarRepuestos =
  document.getElementById("menuAdministrarRepuestos");


// ========================================
// EQUIPO
// ========================================

const tipoEquipo =
  document.getElementById("tipoEquipo");

const contenedorOtroTipo =
  document.getElementById("contenedorOtroTipo");

const otroTipoEquipo =
  document.getElementById("otroTipoEquipo");

const camaraEquipo =
  document.getElementById("camaraEquipo");

const galeriaEquipo =
  document.getElementById("galeriaEquipo");

const contenedorVistaFoto =
  document.getElementById("contenedorVistaFoto");

const vistaFoto =
  document.getElementById("vistaFoto");

const modeloEquipo =
  document.getElementById("modeloEquipo");

const serieEquipo =
  document.getElementById("serieEquipo");

const btnAgregarEquipo =
  document.getElementById("btnAgregarEquipo");


// ========================================
// TABLA
// ========================================

const tablaEquipos =
  document.getElementById("tablaEquipos");

const contenedorTablaEquipos =
  document.getElementById("contenedorTablaEquipos");

const mensajeSinEquipos =
  document.getElementById("mensajeSinEquipos");

const badgeTotalEquipos =
  document.getElementById("badgeTotalEquipos");


// ========================================
// RESUMEN
// ========================================

const tablaResumen =
  document.getElementById("tablaResumen");

const contenedorResumen =
  document.getElementById("contenedorResumen");

const mensajeResumenVacio =
  document.getElementById("mensajeResumenVacio");

const totalEquipos =
  document.getElementById("totalEquipos");


// ========================================
// GUÍA
// ========================================

const camaraGuia =
  document.getElementById("camaraGuia");

const galeriaGuia =
  document.getElementById("galeriaGuia");

const vistaFotoGuia =
  document.getElementById("vistaFotoGuia");

const contenedorFotoGuia =
  document.getElementById("contenedorFotoGuia");


// ========================================
// FOTO GENERAL
// ========================================

const camaraGeneral =
  document.getElementById("camaraGeneral");

const galeriaGeneral =
  document.getElementById("galeriaGeneral");

const vistaFotoGeneral =
  document.getElementById("vistaFotoGeneral");

const contenedorFotoGeneral =
  document.getElementById("contenedorFotoGeneral");


// ========================================
// BOTÓN PDF
// ========================================

const btnGenerarPDF =
  document.getElementById("btnGenerarPDF");


// ========================================
// VARIABLES
// ========================================

let equipos = [];

let fotoEquipoActual = "";

let fotoGuiaActual = "";

let fotoGeneralActual = "";


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
      usuario.nombre || "Usuario";

    nombreTecnico.value =
      usuario.nombre || "";

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
// FECHA ACTUAL GUATEMALA
// ========================================

const hoy =
  new Date().toLocaleDateString(
    "en-CA",
    {
      timeZone:
        "America/Guatemala"
    }
  );

fechaInforme.value =
  hoy;


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

}


// ========================================
// CAMPO OTRO
// ========================================

tipoEquipo.addEventListener(
  "change",
  () => {

    if (tipoEquipo.value === "Otro") {

      contenedorOtroTipo
        .classList.remove("d-none");

      otroTipoEquipo.focus();

    } else {

      contenedorOtroTipo
        .classList.add("d-none");

      otroTipoEquipo.value =
        "";

    }

  }
);


// ========================================
// COMPRIMIR IMAGEN
// ========================================

function comprimirImagen(
  archivo,
  maxDimension = 1400,
  calidad = 0.78
) {

  return new Promise(
    (resolve, reject) => {

      const lector =
        new FileReader();

      lector.onload =
        evento => {

          const imagen =
            new Image();

          imagen.onload =
            () => {

              let ancho =
                imagen.width;

              let alto =
                imagen.height;


              if (
                ancho > maxDimension ||
                alto > maxDimension
              ) {

                const proporcion =
                  Math.min(
                    maxDimension / ancho,
                    maxDimension / alto
                  );

                ancho =
                  Math.round(
                    ancho * proporcion
                  );

                alto =
                  Math.round(
                    alto * proporcion
                  );

              }


              const canvas =
                document.createElement(
                  "canvas"
                );

              canvas.width =
                ancho;

              canvas.height =
                alto;


              const contexto =
                canvas.getContext("2d");


              // Fondo blanco para evitar problemas
              // con imágenes transparentes.

              contexto.fillStyle =
                "#ffffff";

              contexto.fillRect(
                0,
                0,
                ancho,
                alto
              );


              contexto.drawImage(
                imagen,
                0,
                0,
                ancho,
                alto
              );


              resolve(
                canvas.toDataURL(
                  "image/jpeg",
                  calidad
                )
              );

            };


          imagen.onerror =
            reject;

          imagen.src =
            evento.target.result;

        };


      lector.onerror =
        reject;

      lector.readAsDataURL(
        archivo
      );

    }
  );

}


// ========================================
// PROCESAR FOTO DEL EQUIPO
// ========================================

async function procesarFotoEquipo(
  input
) {

  const archivo =
    input.files[0];

  if (!archivo) {
    return;
  }


  if (
    !archivo.type.startsWith("image/")
  ) {

    await Swal.fire({

      icon: "warning",

      title:
        "Archivo no válido",

      text:
        "Debes seleccionar una imagen."

    });

    input.value = "";

    return;

  }


  try {

    fotoEquipoActual =
      await comprimirImagen(
        archivo
      );

    vistaFoto.src =
      fotoEquipoActual;

    contenedorVistaFoto
      .classList.remove("d-none");


    // Si utilizó cámara, limpiamos galería.
    // Si utilizó galería, limpiamos cámara.

    if (input === camaraEquipo) {

      galeriaEquipo.value =
        "";

    } else {

      camaraEquipo.value =
        "";

    }

  } catch (error) {

    console.error(
      "Error procesando foto:",
      error
    );

    await Swal.fire({

      icon: "error",

      title:
        "No se pudo cargar la imagen",

      text:
        "Intenta nuevamente."

    });

  }

}


// ========================================
// EVENTOS FOTO EQUIPO
// ========================================

camaraEquipo.addEventListener(
  "change",
  () => {

    procesarFotoEquipo(
      camaraEquipo
    );

  }
);


galeriaEquipo.addEventListener(
  "change",
  () => {

    procesarFotoEquipo(
      galeriaEquipo
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
          "Tipo requerido",

        text:
          "Selecciona el tipo de equipo."

      });

      return;

    }


    if (tipo === "Otro") {

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
          "Toma una fotografía o selecciona una imagen del equipo."

      });

      return;

    }


    const nuevoEquipo = {

      id:
        generarId(),

      tipo:
        normalizarTipo(tipo),

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

      timer: 1000,

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

function normalizarTipo(
  texto
) {

  const limpio =
    texto
      .trim()
      .replace(/\s+/g, " ");

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


  if (equipos.length === 0) {

    mensajeSinEquipos
      .classList.remove("d-none");

    contenedorTablaEquipos
      .classList.add("d-none");

    badgeTotalEquipos.textContent =
      "0 equipos";

    return;

  }


  mensajeSinEquipos
    .classList.add("d-none");

  contenedorTablaEquipos
    .classList.remove("d-none");


  equipos.forEach(
    (equipo, indice) => {

      const fila =
        document.createElement("tr");


      const numero =
        document.createElement("td");

      numero.textContent =
        indice + 1;


      const foto =
        document.createElement("td");

      const imagen =
        document.createElement("img");

      imagen.src =
        equipo.foto;

      imagen.style.width =
        "70px";

      imagen.style.height =
        "55px";

      imagen.style.objectFit =
        "cover";

      imagen.style.borderRadius =
        "6px";

      foto.appendChild(
        imagen
      );


      const tipo =
        document.createElement("td");

      tipo.textContent =
        equipo.tipo;


      const modelo =
        document.createElement("td");

      modelo.textContent =
        equipo.modelo || "—";


      const serie =
        document.createElement("td");

      serie.textContent =
        equipo.serie || "—";


      const accion =
        document.createElement("td");

      accion.className =
        "text-center";


      const boton =
        document.createElement("button");

      boton.type =
        "button";

      boton.className =
        "btn btn-outline-danger btn-sm";

      boton.innerHTML =
        '<i class="bi bi-trash"></i>';


      boton.addEventListener(
        "click",
        () => {

          eliminarEquipo(
            equipo.id
          );

        }
      );


      accion.appendChild(
        boton
      );


      fila.appendChild(numero);
      fila.appendChild(foto);
      fila.appendChild(tipo);
      fila.appendChild(modelo);
      fila.appendChild(serie);
      fila.appendChild(accion);

      tablaEquipos.appendChild(
        fila
      );

    }
  );


  badgeTotalEquipos.textContent =
    equipos.length === 1
      ? "1 equipo"
      : `${equipos.length} equipos`;

}


// ========================================
// ELIMINAR EQUIPO
// ========================================

async function eliminarEquipo(
  id
) {

  const equipo =
    equipos.find(
      elemento =>
        elemento.id === id
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

      confirmButtonText:
        "Sí, eliminar",

      cancelButtonText:
        "Cancelar",

      confirmButtonColor:
        "#dc3545"

    });


  if (!resultado.isConfirmed) {
    return;
  }


  equipos =
    equipos.filter(
      elemento =>
        elemento.id !== id
    );


  renderizarEquipos();

  actualizarResumen();

}


// ========================================
// OBTENER RESUMEN
// ========================================

function obtenerResumen() {

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


  return Object.values(
    resumen
  ).sort(
    (a, b) =>
      a.nombre.localeCompare(
        b.nombre,
        "es"
      )
  );

}


// ========================================
// ACTUALIZAR RESUMEN
// ========================================

function actualizarResumen() {

  tablaResumen.innerHTML =
    "";


  if (equipos.length === 0) {

    mensajeResumenVacio
      .classList.remove("d-none");

    contenedorResumen
      .classList.add("d-none");

    totalEquipos.textContent =
      "0";

    return;

  }


  mensajeResumenVacio
    .classList.add("d-none");

  contenedorResumen
    .classList.remove("d-none");


  const resumen =
    obtenerResumen();


  resumen.forEach(
    item => {

      const fila =
        document.createElement("tr");

      const tipo =
        document.createElement("td");

      tipo.textContent =
        item.nombre;


      const cantidad =
        document.createElement("td");

      cantidad.className =
        "text-center fw-bold";

      cantidad.textContent =
        item.cantidad;


      fila.appendChild(tipo);
      fila.appendChild(cantidad);

      tablaResumen.appendChild(
        fila
      );

    }
  );


  totalEquipos.textContent =
    equipos.length;

}


// ========================================
// LIMPIAR FORMULARIO DEL EQUIPO
// ========================================

function limpiarFormularioEquipo() {

  tipoEquipo.value =
    "";

  otroTipoEquipo.value =
    "";

  contenedorOtroTipo
    .classList.add("d-none");

  modeloEquipo.value =
    "";

  serieEquipo.value =
    "";

  camaraEquipo.value =
    "";

  galeriaEquipo.value =
    "";

  fotoEquipoActual =
    "";

  vistaFoto.removeAttribute(
    "src"
  );

  contenedorVistaFoto
    .classList.add("d-none");

}


// ========================================
// PROCESAR EVIDENCIA
// ========================================

async function procesarEvidencia(
  input,
  vista,
  contenedor
) {

  const archivo =
    input.files[0];

  if (!archivo) {
    return "";
  }


  if (
    !archivo.type.startsWith("image/")
  ) {

    await Swal.fire({

      icon: "warning",

      title:
        "Archivo no válido",

      text:
        "Selecciona una imagen."

    });

    input.value =
      "";

    return "";

  }


  try {

    const imagen =
      await comprimirImagen(
        archivo
      );

    vista.src =
      imagen;

    contenedor
      .classList.remove("d-none");

    return imagen;

  } catch (error) {

    console.error(
      "Error procesando evidencia:",
      error
    );

    await Swal.fire({

      icon: "error",

      title:
        "No se pudo cargar la imagen",

      text:
        "Intenta nuevamente."

    });

    return "";

  }

}


// ========================================
// GUÍA - CÁMARA
// ========================================

camaraGuia.addEventListener(
  "change",
  async () => {

    const imagen =
      await procesarEvidencia(
        camaraGuia,
        vistaFotoGuia,
        contenedorFotoGuia
      );

    if (imagen) {

      fotoGuiaActual =
        imagen;

      galeriaGuia.value =
        "";

    }

  }
);


// ========================================
// GUÍA - GALERÍA
// ========================================

galeriaGuia.addEventListener(
  "change",
  async () => {

    const imagen =
      await procesarEvidencia(
        galeriaGuia,
        vistaFotoGuia,
        contenedorFotoGuia
      );

    if (imagen) {

      fotoGuiaActual =
        imagen;

      camaraGuia.value =
        "";

    }

  }
);


// ========================================
// GENERAL - CÁMARA
// ========================================

camaraGeneral.addEventListener(
  "change",
  async () => {

    const imagen =
      await procesarEvidencia(
        camaraGeneral,
        vistaFotoGeneral,
        contenedorFotoGeneral
      );

    if (imagen) {

      fotoGeneralActual =
        imagen;

      galeriaGeneral.value =
        "";

    }

  }
);


// ========================================
// GENERAL - GALERÍA
// ========================================

galeriaGeneral.addEventListener(
  "change",
  async () => {

    const imagen =
      await procesarEvidencia(
        galeriaGeneral,
        vistaFotoGeneral,
        contenedorFotoGeneral
      );

    if (imagen) {

      fotoGeneralActual =
        imagen;

      camaraGeneral.value =
        "";

    }

  }
);


// ========================================
// FORMATEAR FECHA
// ========================================

function formatearFecha(
  fecha
) {

  if (!fecha) {
    return "";
  }

  const partes =
    fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return (
    `${partes[2]}/` +
    `${partes[1]}/` +
    `${partes[0]}`
  );

}


// ========================================
// DIMENSIONES IMAGEN PDF
// ========================================

function obtenerDimensionesImagen(
  imagenBase64,
  maxAncho,
  maxAlto
) {

  return new Promise(
    (resolve, reject) => {

      const imagen =
        new Image();

      imagen.onload =
        () => {

          const proporcion =
            Math.min(
              maxAncho /
                imagen.width,

              maxAlto /
                imagen.height
            );

          resolve({

            ancho:
              imagen.width *
              proporcion,

            alto:
              imagen.height *
              proporcion

          });

        };

      imagen.onerror =
        reject;

      imagen.src =
        imagenBase64;

    }
  );

}


// ========================================
// ENCABEZADO PDF
// ========================================

function agregarEncabezadoPDF(
  pdf
) {

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(17);

  pdf.text(
    "TECHASSIST",
    105,
    18,
    {
      align: "center"
    }
  );


  pdf.setFontSize(14);

  pdf.text(
    "INFORME DE EQUIPOS ENVIADOS A BODEGA",
    105,
    27,
    {
      align: "center"
    }
  );


  pdf.setDrawColor(180);

  pdf.line(
    15,
    33,
    195,
    33
  );

}


// ========================================
// VERIFICAR ESPACIO PDF
// ========================================

function verificarEspacioPDF(
  pdf,
  y,
  espacioNecesario
) {

  if (
    y + espacioNecesario >
    280
  ) {

    pdf.addPage();

    agregarEncabezadoPDF(
      pdf
    );

    return 42;

  }

  return y;

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


    if (equipos.length === 0) {

      await Swal.fire({

        icon: "warning",

        title:
          "No hay equipos",

        text:
          "Agrega al menos un equipo antes de generar el PDF."

      });

      return;

    }

    if (
      !window.jspdf ||
      !window.jspdf.jsPDF
    ) {

      await Swal.fire({

        icon: "error",

        title:
          "No se pudo cargar el generador PDF",

        text:
          "Recarga la página e inténtalo nuevamente."

      });

      return;

    }


    const botonOriginal =
      btnGenerarPDF.innerHTML;

    btnGenerarPDF.disabled =
      true;

    btnGenerarPDF.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-1"
      ></span>
      Generando PDF...
    `;


    try {

      const {
        jsPDF
      } = window.jspdf;


      const pdf =
        new jsPDF({

          orientation:
            "portrait",

          unit:
            "mm",

          format:
            "a4",

          compress:
            true

        });


      // =====================================
      // DATOS GENERALES
      // =====================================

      agregarEncabezadoPDF(
        pdf
      );


      let y = 43;


      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(11);


      pdf.text(
        `Fecha: ${formatearFecha(fechaInforme.value)}`,
        18,
        y
      );

      y += 7;


      pdf.text(
        `Técnico: ${nombreTecnico.value || "-"}`,
        18,
        y
      );

      y += 7;


      pdf.text(
        `Bodega: ${bodegaTecnico.value || "-"}`,
        18,
        y
      );

      y += 12;


      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(13);

      pdf.text(
        "DETALLE DE EQUIPOS",
        18,
        y
      );

      y += 9;


      // =====================================
      // EQUIPOS
      // =====================================

      for (
        let indice = 0;
        indice < equipos.length;
        indice++
      ) {

        const equipo =
          equipos[indice];


        y =
          verificarEspacioPDF(
            pdf,
            y,
            85
          );


        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(11);


        pdf.text(
          `${indice + 1}. ${equipo.tipo}`,
          18,
          y
        );

        y += 6;


        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(10);


        pdf.text(
          `Modelo: ${
            equipo.modelo ||
            "No especificado"
          }`,
          22,
          y
        );

        y += 5;


        pdf.text(
          `Número de serie: ${
            equipo.serie ||
            "No especificado"
          }`,
          22,
          y
        );

        y += 7;


        try {

          const dimensiones =
            await obtenerDimensionesImagen(
              equipo.foto,
              85,
              55
            );


          y =
            verificarEspacioPDF(
              pdf,
              y,
              dimensiones.alto + 12
            );


          pdf.addImage(
            equipo.foto,
            "JPEG",
            22,
            y,
            dimensiones.ancho,
            dimensiones.alto,
            undefined,
            "FAST"
          );


          y +=
            dimensiones.alto + 7;

        } catch (error) {

          console.error(
            "Error agregando imagen:",
            error
          );

          pdf.text(
            "No fue posible insertar la fotografía.",
            22,
            y
          );

          y += 7;

        }


        pdf.setDrawColor(220);

        pdf.line(
          18,
          y,
          192,
          y
        );

        y += 8;

      }



      // =====================================
// GUÍA DE ENVÍO - OPCIONAL
// =====================================

if (fotoGuiaActual) {

  pdf.addPage();

  agregarEncabezadoPDF(
    pdf
  );

  y = 43;

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(13);

  pdf.text(
    "GUÍA DE ENVÍO",
    18,
    y
  );

  y += 8;


  const dimensionesGuia =
    await obtenerDimensionesImagen(
      fotoGuiaActual,
      170,
      190
    );


  pdf.addImage(
    fotoGuiaActual,
    "JPEG",
    20,
    y,
    dimensionesGuia.ancho,
    dimensionesGuia.alto,
    undefined,
    "FAST"
  );

}

      // =====================================
// EVIDENCIA GENERAL - OPCIONAL
// =====================================

if (fotoGeneralActual) {

  pdf.addPage();

  agregarEncabezadoPDF(
    pdf
  );

  y = 43;

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(13);

  pdf.text(
    "EVIDENCIA GENERAL DEL ENVÍO",
    18,
    y
  );

  y += 8;


  const dimensionesGeneral =
    await obtenerDimensionesImagen(
      fotoGeneralActual,
      170,
      190
    );


  pdf.addImage(
    fotoGeneralActual,
    "JPEG",
    20,
    y,
    dimensionesGeneral.ancho,
    dimensionesGeneral.alto,
    undefined,
    "FAST"
  );

}


      // =====================================
      // INFORME GENERAL AL FINAL
      // =====================================

      pdf.addPage();

      agregarEncabezadoPDF(
        pdf
      );

      y = 45;


      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(14);


      pdf.text(
        "INFORME GENERAL",
        105,
        y,
        {
          align: "center"
        }
      );

      y += 12;


      const resumen =
        obtenerResumen();


      pdf.setFillColor(
        240,
        240,
        240
      );


      pdf.rect(
        25,
        y,
        160,
        10,
        "F"
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(11);


      pdf.text(
        "Tipo de equipo",
        30,
        y + 7
      );


      pdf.text(
        "Cantidad",
        175,
        y + 7,
        {
          align: "right"
        }
      );


      y += 10;


      resumen.forEach(
        item => {

          pdf.setFont(
            "helvetica",
            "normal"
          );


          pdf.text(
            item.nombre,
            30,
            y + 7
          );


          pdf.text(
            String(item.cantidad),
            175,
            y + 7,
            {
              align: "right"
            }
          );


          pdf.setDrawColor(220);

          pdf.line(
            25,
            y + 10,
            185,
            y + 10
          );


          y += 10;

        }
      );


      y += 3;


      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(12);


      pdf.text(
        "TOTAL DE EQUIPOS",
        30,
        y + 7
      );


      pdf.text(
        String(equipos.length),
        175,
        y + 7,
        {
          align: "right"
        }
      );


      pdf.setDrawColor(100);

      pdf.line(
        25,
        y + 10,
        185,
        y + 10
      );


      // =====================================
      // NUMERACIÓN DE PÁGINAS
      // =====================================

      const cantidadPaginas =
        pdf.getNumberOfPages();


      for (
        let pagina = 1;
        pagina <= cantidadPaginas;
        pagina++
      ) {

        pdf.setPage(
          pagina
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(120);


        pdf.text(
          `Página ${pagina} de ${cantidadPaginas}`,
          105,
          290,
          {
            align: "center"
          }
        );


        pdf.setTextColor(0);

      }


      // =====================================
      // DESCARGAR
      // =====================================

      const fechaArchivo =
        fechaInforme.value ||
        "informe";


      const nombreArchivo =
        `Informe_Equipos_${fechaArchivo}.pdf`;


      pdf.save(
        nombreArchivo
      );


      await Swal.fire({

        icon: "success",

        title:
          "PDF generado",

        html: `
          <p>
            El informe fue generado correctamente.
          </p>

          <p class="mb-0">
            <strong>
              Total de equipos:
            </strong>
            ${equipos.length}
          </p>
        `,

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#0d6efd"

      });

    } catch (error) {

      console.error(
        "Error generando PDF:",
        error
      );


      await Swal.fire({

        icon: "error",

        title:
          "No se pudo generar el PDF",

        text:
          error.message ||
          "Ocurrió un error al generar el informe.",

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#dc3545"

      });

    } finally {

      btnGenerarPDF.disabled =
        false;

      btnGenerarPDF.innerHTML =
        botonOriginal;

    }

  }
);