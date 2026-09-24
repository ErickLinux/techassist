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