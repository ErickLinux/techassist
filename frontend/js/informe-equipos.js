// ========================================
// SESIÓN
// ========================================

const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");


// ========================================
// ELEMENTOS
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
  document.getElementById(
    "menuAdministrarUsuarios"
  );

const menuAdministrarRepuestos =
  document.getElementById(
    "menuAdministrarRepuestos"
  );


// EQUIPO

const tipoEquipo =
  document.getElementById("tipoEquipo");

const fotoEquipo =
  document.getElementById("fotoEquipo");

const contenedorFoto =
  document.getElementById("contenedorFoto");

const vistaFoto =
  document.getElementById("vistaFoto");
  const btnAnalizarFoto =
  document.getElementById(
    "btnAnalizarFoto"
  );

const estadoOCR =
  document.getElementById(
    "estadoOCR"
  );

const textoEstadoOCR =
  document.getElementById(
    "textoEstadoOCR"
  );

const progresoOCR =
  document.getElementById(
    "progresoOCR"
  );
  const contenedorImagenOCR =
  document.getElementById(
    "contenedorImagenOCR"
  );

const vistaImagenOCR =
  document.getElementById(
    "vistaImagenOCR"
  );

const modeloEquipo =
  document.getElementById("modeloEquipo");

const serieEquipo =
  document.getElementById("serieEquipo");

const btnAgregarEquipo =
  document.getElementById("btnAgregarEquipo");

const tablaEquipos =
  document.getElementById("tablaEquipos");

const cantidadRegistrados =
  document.getElementById(
    "cantidadRegistrados"
  );


// RESUMEN

const contenedorResumen =
  document.getElementById(
    "contenedorResumen"
  );

const btnAgregarTipo =
  document.getElementById(
    "btnAgregarTipo"
  );

const totalEquipos =
  document.getElementById(
    "totalEquipos"
  );

const btnGenerarInforme =
  document.getElementById(
    "btnGenerarInforme"
  );


// ========================================
// VARIABLES
// ========================================

let equipos = [];

let fotoActual = null;

let contadorResumen = 0;


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

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
      "./login.html";
  }
}


// ========================================
// FECHA GUATEMALA
// ========================================

const hoy =
  new Date().toLocaleDateString(
    "en-CA",
    {
      timeZone: "America/Guatemala"
    }
  );

fechaInforme.value = hoy;


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
// MOSTRAR FOTO
// ========================================

fotoEquipo.addEventListener(
  "change",
  () => {

    const archivo =
      fotoEquipo.files[0];
      contenedorImagenOCR.classList.add(
  "d-none"
);

vistaImagenOCR.removeAttribute(
  "src"
);

    if (!archivo) {

      fotoActual = null;

      vistaFoto.removeAttribute("src");

      contenedorFoto.classList.add(
        "d-none"
      );

      return;
    }


    if (!archivo.type.startsWith("image/")) {

      Swal.fire({
        icon: "warning",
        title: "Archivo no válido",
        text:
          "Selecciona una fotografía del equipo."
      });

      fotoEquipo.value = "";

      return;
    }


    fotoActual = archivo;


    const lector =
      new FileReader();


    lector.onload = (event) => {

      vistaFoto.src =
        event.target.result;

      contenedorFoto.classList.remove(
        "d-none"
      );
    };


    lector.readAsDataURL(
      archivo
    );
  }
);

// ========================================
// ANALIZAR ETIQUETA CON OCR
// ========================================

btnAnalizarFoto.addEventListener(
  "click",
  async () => {

    if (!fotoActual) {

      await Swal.fire({
        icon: "warning",
        title: "Fotografía requerida",
        text:
          "Primero toma o selecciona una fotografía."
      });

      return;
    }


    try {

      btnAnalizarFoto.disabled = true;

      btnAnalizarFoto.innerHTML = `
        <span
          class="spinner-border spinner-border-sm me-1"
        ></span>
        Analizando...
      `;


      estadoOCR.classList.remove(
        "d-none"
      );

      progresoOCR.style.width =
        "0%";

      textoEstadoOCR.textContent =
        "Preparando imagen...";


      // =====================================
      // MEJORAR IMAGEN
      // =====================================

      const imagenProcesada =
        await prepararImagenOCR(
          vistaFoto
        );


      textoEstadoOCR.textContent =
        "Iniciando reconocimiento...";


      // =====================================
      // OCR
      // =====================================

      const resultado =
        await Tesseract.recognize(
          imagenProcesada,
          "eng",
          {
            logger: mensaje => {

              actualizarProgresoOCR(
                mensaje
              );
            }
          }
        );


      const texto =
        resultado.data.text;


      console.log(
        "=============================="
      );

      console.log(
        "TEXTO OCR DETECTADO:"
      );

      console.log(texto);

      console.log(
        "=============================="
      );


      const datos =
        extraerDatosEtiqueta(
          texto
        );


      console.log(
        "DATOS EXTRAÍDOS:",
        datos
      );


      if (datos.modelo) {

        modeloEquipo.value =
          datos.modelo;
      }


      if (datos.serie) {

        serieEquipo.value =
          datos.serie;
      }


      estadoOCR.classList.add(
        "d-none"
      );


      if (
        datos.modelo &&
        datos.serie
      ) {

        await Swal.fire({

          icon: "success",

          title:
            "Datos detectados",

          html: `
            <div class="text-start">

              <p>
                TechAssist detectó los siguientes
                datos. Revísalos antes de agregar
                el equipo.
              </p>

              <div class="mb-2">
                <strong>Modelo:</strong>
                ${datos.modelo}
              </div>

              <div>
                <strong>Serie:</strong>
                ${datos.serie}
              </div>

            </div>
          `
        });

      } else {

        await Swal.fire({

          icon: "warning",

          title:
            "Detección incompleta",

          html: `
            <p>
              TechAssist no pudo identificar
              automáticamente todos los datos.
            </p>

            <p class="mb-0">
              Intenta acercar más la cámara
              a la etiqueta.
            </p>
          `
        });
      }


    } catch (error) {

      console.error(
        "Error OCR:",
        error
      );


      estadoOCR.classList.add(
        "d-none"
      );


      await Swal.fire({

        icon: "error",

        title:
          "No fue posible analizar la imagen",

        text:
          "Intenta tomar una fotografía más cercana y clara de la etiqueta."
      });


    } finally {

      btnAnalizarFoto.disabled =
        false;


      btnAnalizarFoto.innerHTML = `
        <i class="bi bi-search me-1"></i>
        Detectar modelo y serie
      `;
    }
  }
);


// ========================================
// PREPARAR IMAGEN PARA OCR
// ========================================

function prepararImagenOCR(
  imagen
) {

  return new Promise(
    (resolve, reject) => {

      try {

        // =====================================
        // CANVAS ORIGINAL
        // =====================================

        const canvasOriginal =
          document.createElement(
            "canvas"
          );

        const ctxOriginal =
          canvasOriginal.getContext(
            "2d",
            {
              willReadFrequently: true
            }
          );


        canvasOriginal.width =
          imagen.naturalWidth;

        canvasOriginal.height =
          imagen.naturalHeight;


        ctxOriginal.drawImage(
          imagen,
          0,
          0
        );


        const ancho =
          canvasOriginal.width;

        const alto =
          canvasOriginal.height;


        // =====================================
        // BUSCAR ZONA CLARA
        // =====================================

        const datosOriginales =
          ctxOriginal.getImageData(
            0,
            0,
            ancho,
            alto
          );


        const pixeles =
          datosOriginales.data;


        let minX = ancho;
        let minY = alto;

        let maxX = 0;
        let maxY = 0;

        let encontrados = 0;


        // Analizamos bloques en vez de
        // cada píxel para mejorar rendimiento.

        const salto = 4;


        for (
          let y = 0;
          y < alto;
          y += salto
        ) {

          for (
            let x = 0;
            x < ancho;
            x += salto
          ) {

            const indice =
              (
                y * ancho +
                x
              ) * 4;


            const r =
              pixeles[indice];

            const g =
              pixeles[indice + 1];

            const b =
              pixeles[indice + 2];


            const brillo =
              (
                r +
                g +
                b
              ) / 3;


            // Buscamos zonas bastante claras.
            // La etiqueta del ejemplo tiene
            // fondo blanco/gris claro.

            if (brillo > 165) {

              minX =
                Math.min(
                  minX,
                  x
                );

              minY =
                Math.min(
                  minY,
                  y
                );

              maxX =
                Math.max(
                  maxX,
                  x
                );

              maxY =
                Math.max(
                  maxY,
                  y
                );

              encontrados++;
            }
          }
        }


        // =====================================
        // DEFINIR RECORTE
        // =====================================

        let recorteX = 0;
        let recorteY = 0;

        let recorteAncho =
          ancho;

        let recorteAlto =
          alto;


        if (
          encontrados > 50 &&
          maxX > minX &&
          maxY > minY
        ) {

          // Margen alrededor de la zona
          // detectada.

          const margenX =
            Math.round(
              ancho * 0.025
            );

          const margenY =
            Math.round(
              alto * 0.04
            );


          recorteX =
            Math.max(
              0,
              minX - margenX
            );

          recorteY =
            Math.max(
              0,
              minY - margenY
            );


          const limiteX =
            Math.min(
              ancho,
              maxX + margenX
            );

          const limiteY =
            Math.min(
              alto,
              maxY + margenY
            );


          recorteAncho =
            limiteX -
            recorteX;

          recorteAlto =
            limiteY -
            recorteY;
        }


        console.log(
          "RECORTE OCR:",
          {
            x: recorteX,
            y: recorteY,
            ancho: recorteAncho,
            alto: recorteAlto
          }
        );


        // =====================================
        // AMPLIAR RECORTE
        // =====================================

        const escala = 3;


        const canvasOCR =
          document.createElement(
            "canvas"
          );


        canvasOCR.width =
          Math.round(
            recorteAncho *
            escala
          );

        canvasOCR.height =
          Math.round(
            recorteAlto *
            escala
          );


        const ctxOCR =
          canvasOCR.getContext(
            "2d",
            {
              willReadFrequently: true
            }
          );


        // Suavizado al ampliar

        ctxOCR.imageSmoothingEnabled =
          true;

        ctxOCR.imageSmoothingQuality =
          "high";


        ctxOCR.drawImage(
          canvasOriginal,

          recorteX,
          recorteY,
          recorteAncho,
          recorteAlto,

          0,
          0,
          canvasOCR.width,
          canvasOCR.height
        );


        // =====================================
        // ESCALA DE GRISES
        // =====================================

        const datosOCR =
          ctxOCR.getImageData(
            0,
            0,
            canvasOCR.width,
            canvasOCR.height
          );


        const pixelesOCR =
          datosOCR.data;


        for (
          let i = 0;
          i < pixelesOCR.length;
          i += 4
        ) {

          const r =
            pixelesOCR[i];

          const g =
            pixelesOCR[i + 1];

          const b =
            pixelesOCR[i + 2];


          let gris =
            (
              r * 0.299 +
              g * 0.587 +
              b * 0.114
            );


          // =================================
          // AUMENTAR CONTRASTE
          // =================================

          gris =
            (
              (gris - 128) *
              1.7
            ) + 128;


          gris =
            Math.max(
              0,
              Math.min(
                255,
                gris
              )
            );


          pixelesOCR[i] =
            gris;

          pixelesOCR[i + 1] =
            gris;

          pixelesOCR[i + 2] =
            gris;
        }


        ctxOCR.putImageData(
          datosOCR,
          0,
          0
        );


        // =====================================
        // GENERAR IMAGEN
        // =====================================

        const imagenProcesada =
          canvasOCR.toDataURL(
            "image/png"
          );


        // Mostrar exactamente lo que
        // recibirá Tesseract.

        vistaImagenOCR.src =
          imagenProcesada;

        contenedorImagenOCR
          .classList.remove(
            "d-none"
          );


        resolve(
          imagenProcesada
        );


      } catch (error) {

        reject(error);
      }
    }
  );
}


// ========================================
// PROGRESO OCR
// ========================================

function actualizarProgresoOCR(
  mensaje
) {

  if (
    mensaje.status ===
    "recognizing text"
  ) {

    const porcentaje =
      Math.round(
        (mensaje.progress || 0) *
        100
      );


    progresoOCR.style.width =
      `${porcentaje}%`;


    textoEstadoOCR.textContent =
      `Reconociendo texto: ${porcentaje}%`;
  }

  else if (
    mensaje.status ===
    "loading language traineddata"
  ) {

    textoEstadoOCR.textContent =
      "Cargando reconocimiento...";
  }

  else {

    textoEstadoOCR.textContent =
      "Procesando etiqueta...";
  }
}


// ========================================
// EXTRAER MODELO Y SERIE
// ========================================

function extraerDatosEtiqueta(
  texto
) {

  let modelo = "";
  let serie = "";


  // =====================================
  // NORMALIZAR TEXTO
  // =====================================

  const lineas =
    texto
      .split(/\r?\n/)
      .map(
        linea =>
          linea
            .replace(/\s+/g, " ")
            .trim()
      )
      .filter(Boolean);


  console.log(
    "LÍNEAS OCR:",
    lineas
  );


  // =====================================
  // RECORRER LÍNEAS
  // =====================================

  for (
    let i = 0;
    i < lineas.length;
    i++
  ) {

    const linea =
      lineas[i];


    // ===================================
    // MODELO
    // ===================================

    if (!modelo) {

      let coincidencia =
        linea.match(
          /(?:MODEL\s*ID|MODEL\s*NO|MODEL\s*NUMBER|MODEL|MODELO)\s*[:.#-]?\s*([A-Z0-9][A-Z0-9._\/-]{2,})/i
        );


      if (
        coincidencia &&
        coincidencia[1]
      ) {

        modelo =
          coincidencia[1];
      }


      // Puede ocurrir:
      //
      // MODEL ID
      // 278M1R/00

      else if (
        /MODEL|MODELO/i.test(
          linea
        )
      ) {

        const siguiente =
          lineas[i + 1];


        if (
          siguiente &&
          /^[A-Z0-9._\/-]{3,}$/i.test(
            siguiente
          )
        ) {

          modelo =
            siguiente;
        }
      }
    }


    // ===================================
    // SERIE
    // ===================================

    if (!serie) {

      let coincidencia =
        linea.match(
          /(?:SERIAL\s*NUMBER|SERIAL\s*NO|SERIAL|S\/N|SN|SERIE)\s*[:.#-]?\s*([A-Z0-9][A-Z0-9._\/-]{4,})/i
        );


      if (
        coincidencia &&
        coincidencia[1]
      ) {

        serie =
          coincidencia[1];
      }


      // Puede ocurrir:
      //
      // SERIAL NUMBER
      // UK82124000064

      else if (
        /SERIAL|SERIE|S\/N/i.test(
          linea
        )
      ) {

        const siguiente =
          lineas[i + 1];


        if (
          siguiente &&
          /^[A-Z0-9._\/-]{5,}$/i.test(
            siguiente
          )
        ) {

          serie =
            siguiente;
        }
      }
    }
  }


  // =====================================
  // LIMPIEZA
  // =====================================

  modelo =
    limpiarDatoDetectado(
      modelo
    );

  serie =
    limpiarDatoDetectado(
      serie
    );


  return {
    modelo,
    serie
  };
}


// ========================================
// LIMPIAR DATO
// ========================================

function limpiarDatoDetectado(
  valor
) {

  if (!valor) {
    return "";
  }


  return valor
    .trim()
    .replace(
      /^[=:;#\s-]+/,
      ""
    )
    .replace(
      /[|,;]+$/,
      ""
    )
    .trim();
}




// ========================================
// AGREGAR EQUIPO
// ========================================

btnAgregarEquipo.addEventListener(
  "click",
  async () => {

    const tipo =
      tipoEquipo.value.trim();

    const modelo =
      modeloEquipo.value.trim();

    const serie =
      serieEquipo.value.trim();


    if (!tipo) {

      await Swal.fire({
        icon: "warning",
        title: "Tipo requerido",
        text:
          "Selecciona el tipo de equipo."
      });

      return;
    }


    if (!fotoActual) {

      await Swal.fire({
        icon: "warning",
        title: "Fotografía requerida",
        text:
          "Toma o selecciona una fotografía del equipo."
      });

      return;
    }


    if (!modelo) {

      await Swal.fire({
        icon: "warning",
        title: "Modelo requerido",
        text:
          "Ingresa el modelo del equipo."
      });

      return;
    }


    if (!serie) {

      await Swal.fire({
        icon: "warning",
        title: "Serie requerida",
        text:
          "Ingresa el número de serie."
      });

      return;
    }


    const serieDuplicada =
      equipos.some(
        equipo =>
          equipo.serie.toLowerCase() ===
          serie.toLowerCase()
      );


    if (serieDuplicada) {

      await Swal.fire({
        icon: "warning",
        title: "Serie duplicada",
        text:
          "Ya agregaste un equipo con esta serie."
      });

      return;
    }


    const equipo = {

      id:
        Date.now(),

      tipo,

      modelo,

      serie,

      foto:
        vistaFoto.src
    };


    equipos.push(
      equipo
    );


    actualizarTablaEquipos();

    limpiarFormularioEquipo();

  }
);


// ========================================
// ACTUALIZAR TABLA
// ========================================

function actualizarTablaEquipos() {

  tablaEquipos.innerHTML = "";


  if (equipos.length === 0) {

    tablaEquipos.innerHTML = `
      <tr>

        <td
          colspan="6"
          class="text-center text-secondary py-4"
        >
          Todavía no has agregado equipos.
        </td>

      </tr>
    `;

  } else {

    equipos.forEach(
      (equipo, indice) => {

        const fila =
          document.createElement("tr");


        fila.innerHTML = `

          <td>
            ${indice + 1}
          </td>

          <td>
            ${equipo.tipo}
          </td>

          <td>
            ${equipo.modelo}
          </td>

          <td>
            ${equipo.serie}
          </td>

          <td>

            <img
              src="${equipo.foto}"
              alt="Equipo"
              style="
                width: 70px;
                height: 50px;
                object-fit: cover;
              "
              class="rounded border"
            >

          </td>

          <td>

            <button
              type="button"
              class="btn btn-sm btn-outline-danger btn-eliminar-equipo"
              data-id="${equipo.id}"
            >

              <i class="bi bi-trash"></i>

            </button>

          </td>
        `;


        tablaEquipos.appendChild(
          fila
        );
      }
    );
  }


  cantidadRegistrados.textContent =
    equipos.length;


  actualizarBotonPDF();
}


// ========================================
// ELIMINAR EQUIPO
// ========================================

tablaEquipos.addEventListener(
  "click",
  async (event) => {

    const boton =
      event.target.closest(
        ".btn-eliminar-equipo"
      );


    if (!boton) {
      return;
    }


    const id =
      Number(
        boton.dataset.id
      );


    const resultado =
      await Swal.fire({

        icon: "warning",

        title:
          "¿Eliminar equipo?",

        text:
          "Se quitará del informe actual.",

        showCancelButton: true,

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
        equipo =>
          equipo.id !== id
      );


    actualizarTablaEquipos();
  }
);


// ========================================
// LIMPIAR EQUIPO
// ========================================

function limpiarFormularioEquipo() {

  tipoEquipo.value = "";

  modeloEquipo.value = "";

  serieEquipo.value = "";

  fotoEquipo.value = "";

  fotoActual = null;

  vistaFoto.removeAttribute(
    "src"
  );

  contenedorFoto.classList.add(
    "d-none"
  );
}


// ========================================
// AGREGAR FILA AL RESUMEN
// ========================================

function agregarFilaResumen(
  tipoInicial = "",
  cantidadInicial = ""
) {

  contadorResumen++;


  const fila =
    document.createElement("div");


  fila.className =
    "col-12 fila-resumen";


  fila.dataset.id =
    contadorResumen;


  fila.innerHTML = `

    <div class="row g-2 align-items-end">

      <div class="col-7 col-md-8">

        <label class="form-label">
          Tipo de equipo
        </label>

        <input
          type="text"
          class="form-control tipo-resumen"
          placeholder="Ej. Monitores"
          value="${tipoInicial}"
        >

      </div>


      <div class="col-3 col-md-3">

        <label class="form-label">
          Cantidad
        </label>

        <input
          type="number"
          class="form-control cantidad-resumen"
          min="0"
          value="${cantidadInicial}"
        >

      </div>


      <div class="col-2 col-md-1">

        <button
          type="button"
          class="btn btn-outline-danger w-100 btn-eliminar-resumen"
        >

          <i class="bi bi-trash"></i>

        </button>

      </div>

    </div>
  `;


  contenedorResumen.appendChild(
    fila
  );
}


// ========================================
// BOTÓN AGREGAR TIPO
// ========================================

btnAgregarTipo.addEventListener(
  "click",
  () => {

    agregarFilaResumen();
  }
);


// ========================================
// CAMBIOS EN RESUMEN
// ========================================

contenedorResumen.addEventListener(
  "input",
  () => {

    calcularTotal();
  }
);


// ========================================
// ELIMINAR FILA RESUMEN
// ========================================

contenedorResumen.addEventListener(
  "click",
  (event) => {

    const boton =
      event.target.closest(
        ".btn-eliminar-resumen"
      );


    if (!boton) {
      return;
    }


    boton
      .closest(".fila-resumen")
      .remove();


    calcularTotal();
  }
);


// ========================================
// CALCULAR TOTAL
// ========================================

function calcularTotal() {

  const cantidades =
    document.querySelectorAll(
      ".cantidad-resumen"
    );


  let total = 0;


  cantidades.forEach(
    campo => {

      const cantidad =
        Number(
          campo.value
        ) || 0;


      if (cantidad > 0) {

        total +=
          cantidad;
      }
    }
  );


  totalEquipos.textContent =
    total;


  actualizarBotonPDF();
}


// ========================================
// ACTIVAR BOTÓN PDF
// ========================================

function actualizarBotonPDF() {

  const total =
    Number(
      totalEquipos.textContent
    ) || 0;


  btnGenerarInforme.disabled =
    equipos.length === 0 ||
    total === 0;
}


// ========================================
// GENERAR PDF
// ========================================

btnGenerarInforme.addEventListener(
  "click",
  () => {

    Swal.fire({

      icon: "info",

      title:
        "Generación de PDF",

      text:
        "En el siguiente paso conectaremos la generación del informe PDF."
    });
  }
);


// ========================================
// PRIMERA FILA DEL RESUMEN
// ========================================

agregarFilaResumen();