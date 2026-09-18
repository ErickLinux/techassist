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


let modalNuevoRepuesto = null;


if (modalNuevoRepuestoElemento) {

  modalNuevoRepuesto =
    bootstrap.Modal.getOrCreateInstance(
      modalNuevoRepuestoElemento
    );
}


// ========================================
// VALIDAR SESIÓN Y ADMIN
// ========================================

if (!token || !usuarioGuardado) {

  window.location.href =
    "./index.html";

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
      "./index.html";
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
        "./index.html";
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

        imagenUrl: ""
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
// INICIAR
// ========================================

cargarRepuestos();