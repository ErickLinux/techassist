const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");


const nombreUsuario =
  document.getElementById("nombreUsuario");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const btnMenu =
  document.getElementById("btnMenu");

const sidebar =
  document.getElementById("sidebar");

const btnNuevoRepuesto =
  document.getElementById("btnNuevoRepuesto");

const formNuevoRepuesto =
  document.getElementById("formNuevoRepuesto");

const modalNuevoRepuestoElemento =
  document.getElementById("modalNuevoRepuesto");

const tablaRepuestos =
  document.getElementById("tablaRepuestos");

const tablaRepuestosContenedor =
  document.getElementById(
    "tablaRepuestosContenedor"
  );

const cargandoRepuestos =
  document.getElementById(
    "cargandoRepuestos"
  );

  const modalEditarRepuestoElemento =
  document.getElementById(
    "modalEditarRepuesto"
  );

const formEditarRepuesto =
  document.getElementById(
    "formEditarRepuesto"
  );


let modalNuevoRepuesto = null;
let modalEditarRepuesto = null;

let repuestosCargados = [];

let repuestoEditandoId = null;


if (modalNuevoRepuestoElemento) {

  modalNuevoRepuesto =
    bootstrap.Modal.getOrCreateInstance(
      modalNuevoRepuestoElemento
    );
}

// ========================================
// CONVERTIR URL DE GOOGLE DRIVE
// ========================================

function convertirUrlDrive(url) {

  if (!url) {
    return "";
  }

  const texto =
    url.trim();

  let idArchivo = null;


  // Formato:
  // drive.google.com/file/d/ID/view

  const coincidenciaFile =
    texto.match(
      /\/file\/d\/([^/]+)/
    );

  if (coincidenciaFile) {
    idArchivo =
      coincidenciaFile[1];
  }


  // Formato:
  // drive.google.com/open?id=ID

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

const imagenUrl =
  document.getElementById(
    "imagenUrl"
  );

const imagenPreviaNueva =
  document.getElementById(
    "imagenPreviaNueva"
  );

const vistaPreviaNueva =
  document.getElementById(
    "vistaPreviaNueva"
  );


if (imagenUrl) {

  imagenUrl.addEventListener(
    "input",
    () => {

      const url =
        convertirUrlDrive(
          imagenUrl.value
        );


      if (!url) {

        vistaPreviaNueva.classList.add(
          "d-none"
        );

        imagenPreviaNueva.removeAttribute(
          "src"
        );

        return;
      }


      imagenPreviaNueva.src =
        url;

      vistaPreviaNueva.classList.remove(
        "d-none"
      );
    }
  );
}

// ========================================
// VALIDAR SESIÓN Y ADMIN
// ========================================

if (!token || !usuarioGuardado) {

  window.location.href =
    "./login.html";

} else {

  try {

    const usuario =
      JSON.parse(usuarioGuardado);

    if (usuario.rol !== "ADMIN") {

      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text:
          "No tienes permisos para administrar repuestos.",
        confirmButtonText: "Volver al inicio",
        confirmButtonColor: "#dc3545"
      }).then(() => {

        window.location.href =
          "./dashboard.html";

      });

    } else {

      nombreUsuario.textContent =
        usuario.nombre;
    }

  } catch (error) {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
      "./login.html";
  }
}


// ========================================
// MENÚ
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
// ABRIR MODAL
// ========================================

if (btnNuevoRepuesto) {

  btnNuevoRepuesto.addEventListener(
    "click",
    () => {

      formNuevoRepuesto.reset();

      modalNuevoRepuesto.show();
    }
  );
}
if (modalEditarRepuestoElemento) {

  modalEditarRepuesto =
    bootstrap.Modal.getOrCreateInstance(
      modalEditarRepuestoElemento
    );
}

// ========================================
// CARGAR REPUESTOS
// ========================================

async function cargarRepuestos() {

  cargandoRepuestos.classList.remove(
    "d-none"
  );

  tablaRepuestosContenedor.classList.add(
    "d-none"
  );


  try {

    const respuesta =
      await fetch(
        `${API_URL}/api/repuestos/admin/listar`,
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
        "No fue posible consultar los repuestos"
      );
    }
    repuestosCargados =
  resultado.repuestos || [];


    tablaRepuestos.innerHTML = "";


    if (
      !resultado.repuestos ||
      resultado.repuestos.length === 0
    ) {

      cargandoRepuestos.innerHTML = `
        <div class="alert alert-info">
          No hay repuestos registrados.
        </div>
      `;

      return;
    }


    resultado.repuestos.forEach(
      (repuesto) => {

        const fila =
          document.createElement("tr");


        fila.innerHTML = `
  <td>
    <strong>
      ${repuesto.nombre}
    </strong>
  </td>

  <td>
    ${repuesto.numeroParte}
  </td>

  <td>
    ${repuesto.tipoEquipo || "-"}
  </td>

  <td>
    <span
      class="badge ${
        repuesto.activo
          ? "text-bg-success"
          : "text-bg-secondary"
      }"
    >
      ${
        repuesto.activo
          ? "Activo"
          : "Inactivo"
      }
    </span>
  </td>

  <td>
    <div class="d-flex gap-2">

      <button
        type="button"
        class="btn btn-sm btn-outline-primary btn-editar-repuesto"
        data-id="${repuesto.id}"
      >
        <i class="bi bi-pencil-square"></i>
        Editar
      </button>

      <button
        type="button"
        class="btn btn-sm ${
          repuesto.activo
            ? "btn-outline-danger"
            : "btn-outline-success"
        } btn-estado-repuesto"
        data-id="${repuesto.id}"
        data-activo="${repuesto.activo}"
      >
        <i
          class="bi ${
            repuesto.activo
              ? "bi-x-circle"
              : "bi-check-circle"
          }"
        ></i>

        ${
          repuesto.activo
            ? "Desactivar"
            : "Activar"
        }
      </button>

    </div>
  </td>
`;


        tablaRepuestos.appendChild(
          fila
        );
      }
    );


    cargandoRepuestos.classList.add(
      "d-none"
    );

    tablaRepuestosContenedor.classList.remove(
      "d-none"
    );


  } catch (error) {

    console.error(
      "Error cargando repuestos:",
      error
    );

    cargandoRepuestos.innerHTML = `
      <div class="alert alert-danger">
        ${error.message}
      </div>
    `;
  }
}


// ========================================
// CREAR REPUESTO
// ========================================

if (formNuevoRepuesto) {

  formNuevoRepuesto.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const datos = {

        nombre:
          document
            .getElementById("nombreRepuesto")
            .value
            .trim(),

        numeroParte:
          document
            .getElementById("numeroParte")
            .value
            .trim(),

        tipoEquipo:
          document
            .getElementById("tipoEquipo")
            .value
            .trim(),

        descripcion:
          document
            .getElementById("descripcionRepuesto")
            .value
            .trim(),

        imagenUrl:
  convertirUrlDrive(
    document
      .getElementById("imagenUrl")
      .value
  )
      };


      try {

        const respuesta =
          await fetch(
            `${API_URL}/api/repuestos`,
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
            "No fue posible crear el repuesto"
          );
        }


        modalNuevoRepuesto.hide();

        formNuevoRepuesto.reset();

        await cargarRepuestos();


        await Swal.fire({
          icon: "success",
          title: "¡Repuesto creado!",
          text:
            "El repuesto se agregó correctamente al catálogo.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#0d6efd"
        });


      } catch (error) {

        console.error(
          "Error creando repuesto:",
          error
        );


        await Swal.fire({
          icon: "error",
          title: "No se pudo crear",
          text: error.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#dc3545"
        });
      }
    }
  );
}


// ========================================
// ABRIR EDICIÓN DE REPUESTO
// ========================================

tablaRepuestos.addEventListener(
  "click",
  (event) => {

    const boton =
      event.target.closest(
        ".btn-editar-repuesto"
      );


    if (!boton) {
      return;
    }


    const id =
      boton.dataset.id;


    const repuesto =
      repuestosCargados.find(
        (item) => item.id === id
      );


    if (!repuesto) {

      Swal.fire({
        icon: "error",
        title: "Repuesto no encontrado",
        text:
          "No fue posible obtener la información del repuesto."
      });

      return;
    }


    repuestoEditandoId =
      repuesto.id;


    document.getElementById(
      "editarNombreRepuesto"
    ).value =
      repuesto.nombre || "";


    document.getElementById(
      "editarNumeroParte"
    ).value =
      repuesto.numeroParte || "";


    document.getElementById(
      "editarTipoEquipo"
    ).value =
      repuesto.tipoEquipo || "";


    document.getElementById(
      "editarDescripcionRepuesto"
    ).value =
      repuesto.descripcion || "";
      const editarImagenUrl =
  document.getElementById(
    "editarImagenUrl"
  );

const imagenPreviaEditar =
  document.getElementById(
    "imagenPreviaEditar"
  );

const vistaPreviaEditar =
  document.getElementById(
    "vistaPreviaEditar"
  );


editarImagenUrl.value =
  repuesto.imagenUrl || "";


if (repuesto.imagenUrl) {

  imagenPreviaEditar.src =
    repuesto.imagenUrl;

  vistaPreviaEditar.classList.remove(
    "d-none"
  );

} else {

  imagenPreviaEditar.removeAttribute(
    "src"
  );

  vistaPreviaEditar.classList.add(
    "d-none"
  );
}


    modalEditarRepuesto.show();
  }
);


const editarImagenUrlInput =
  document.getElementById(
    "editarImagenUrl"
  );


if (editarImagenUrlInput) {

  editarImagenUrlInput.addEventListener(
    "input",
    () => {

      const url =
        convertirUrlDrive(
          editarImagenUrlInput.value
        );


      const imagen =
        document.getElementById(
          "imagenPreviaEditar"
        );

      const contenedor =
        document.getElementById(
          "vistaPreviaEditar"
        );


      if (!url) {

        imagen.removeAttribute("src");

        contenedor.classList.add(
          "d-none"
        );

        return;
      }


      imagen.src =
        url;

      contenedor.classList.remove(
        "d-none"
      );
    }
  );
}
// ========================================
// GUARDAR EDICIÓN DE REPUESTO
// ========================================

if (formEditarRepuesto) {

  formEditarRepuesto.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (!repuestoEditandoId) {
        return;
      }


      const datos = {

        nombre:
          document
            .getElementById(
              "editarNombreRepuesto"
            )
            .value
            .trim(),

        numeroParte:
          document
            .getElementById(
              "editarNumeroParte"
            )
            .value
            .trim(),

        tipoEquipo:
          document
            .getElementById(
              "editarTipoEquipo"
            )
            .value
            .trim(),

        descripcion:
          document
            .getElementById(
              "editarDescripcionRepuesto"
            )
            .value
            .trim(),
            imagenUrl:
  convertirUrlDrive(
    document
      .getElementById(
        "editarImagenUrl"
      )
      .value
  )
      };


      if (!datos.nombre) {

        await Swal.fire({
          icon: "warning",
          title: "Nombre requerido",
          text:
            "Ingresa el nombre del repuesto."
        });

        return;
      }


      if (!datos.numeroParte) {

        await Swal.fire({
          icon: "warning",
          title:
            "Número de parte requerido",
          text:
            "Ingresa el número de parte o modelo."
        });

        return;
      }


      try {

        const respuesta =
          await fetch(
            `${API_URL}/api/repuestos/admin/${repuestoEditandoId}`,
            {
              method: "PUT",

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
            "No fue posible actualizar el repuesto"
          );
        }


        modalEditarRepuesto.hide();

        repuestoEditandoId = null;


        await cargarRepuestos();


        await Swal.fire({
          icon: "success",
          title:
            "Repuesto actualizado",
          text:
            "Los cambios se guardaron correctamente.",
          confirmButtonText:
            "Aceptar",
          confirmButtonColor:
            "#0d6efd"
        });


      } catch (error) {

        console.error(
          "Error editando repuesto:",
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
      }
    }
  );
}




// ========================================
// ACTIVAR / DESACTIVAR REPUESTO
// ========================================

tablaRepuestos.addEventListener(
  "click",
  async (event) => {

    const boton =
      event.target.closest(
        ".btn-estado-repuesto"
      );


    if (!boton) {
      return;
    }


    const id =
      boton.dataset.id;

    const activoActual =
      boton.dataset.activo === "true";

    const nuevoEstado =
      !activoActual;


    const confirmacion =
      await Swal.fire({

        icon: "question",

        title:
          nuevoEstado
            ? "¿Activar repuesto?"
            : "¿Desactivar repuesto?",

        text:
          nuevoEstado
            ? "El repuesto volverá a aparecer en las solicitudes."
            : "El repuesto dejará de aparecer en las solicitudes nuevas.",

        showCancelButton: true,

        confirmButtonText:
          nuevoEstado
            ? "Sí, activar"
            : "Sí, desactivar",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          nuevoEstado
            ? "#198754"
            : "#dc3545"
      });


    if (!confirmacion.isConfirmed) {
      return;
    }


    try {

      const respuesta =
        await fetch(
          `${API_URL}/api/repuestos/admin/${id}/estado`,
          {
            method: "PATCH",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify({
                activo: nuevoEstado
              })
          }
        );


      const resultado =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          resultado.mensaje ||
          "No fue posible cambiar el estado"
        );
      }


      await cargarRepuestos();


      await Swal.fire({

        icon: "success",

        title:
          nuevoEstado
            ? "Repuesto activado"
            : "Repuesto desactivado",

        text:
          resultado.mensaje,

        timer: 1600,

        showConfirmButton: false
      });


    } catch (error) {

      console.error(
        "Error cambiando estado:",
        error
      );


      await Swal.fire({

        icon: "error",

        title:
          "No se pudo modificar",

        text:
          error.message,

        confirmButtonText:
          "Aceptar"
      });
    }
  }
);

// ========================================
// INICIAR
// ========================================

cargarRepuestos();