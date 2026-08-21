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

const btnNuevoUsuario =
  document.getElementById(
    "btnNuevoUsuario"
  );

const modalNuevoUsuarioElemento =
  document.getElementById(
    "modalNuevoUsuario"
  );

const formNuevoUsuario =
  document.getElementById(
    "formNuevoUsuario"
  );

const tablaUsuarios =
  document.getElementById(
    "tablaUsuarios"
  );

const tablaUsuariosContenedor =
  document.getElementById(
    "tablaUsuariosContenedor"
  );

const cargandoUsuarios =
  document.getElementById(
    "cargandoUsuarios"
  );


// ==============================
// ELEMENTOS MODAL EDITAR
// ==============================

const modalEditarUsuarioElemento =
  document.getElementById(
    "modalEditarUsuario"
  );

const formEditarUsuario =
  document.getElementById(
    "formEditarUsuario"
  );


// ==============================
// MODALES BOOTSTRAP
// ==============================

let modalNuevoUsuario = null;
let modalEditarUsuario = null;

if (modalNuevoUsuarioElemento) {

  modalNuevoUsuario =
    bootstrap.Modal.getOrCreateInstance(
      modalNuevoUsuarioElemento
    );
}

if (modalEditarUsuarioElemento) {

  modalEditarUsuario =
    bootstrap.Modal.getOrCreateInstance(
      modalEditarUsuarioElemento
    );
}


// ==============================
// VALIDAR SESIÓN Y ROL
// ==============================

if (!token || !usuarioGuardado) {

  window.location.href =
    "./index.html";

} else {

  try {

    const usuario =
      JSON.parse(usuarioGuardado);

    if (usuario.rol !== "ADMIN") {

      alert(
        "No tienes permisos para acceder a esta sección"
      );

      window.location.href =
        "./dashboard.html";

    } else {

      if (nombreUsuario) {
        nombreUsuario.textContent =
          usuario.nombre;
      }
    }

  } catch (error) {

    console.error(
      "Error leyendo usuario:",
      error
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );

    window.location.href =
      "./index.html";
  }
}


// ==============================
// MENÚ
// ==============================

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


// ==============================
// CERRAR SESIÓN
// ==============================

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
        "./index.html";
    }
  );
}


// ==============================
// CARGAR USUARIOS
// ==============================

async function cargarUsuarios() {

  if (
    !tablaUsuarios ||
    !tablaUsuariosContenedor ||
    !cargandoUsuarios
  ) {

    console.error(
      "Faltan elementos de la tabla de usuarios en usuarios.html"
    );

    return;
  }


  cargandoUsuarios.classList.remove(
    "d-none"
  );

  tablaUsuariosContenedor.classList.add(
    "d-none"
  );


  try {

    const respuesta =
      await fetch(
        `${API_URL}/api/admin/usuarios`,
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

      const datosError =
        await respuesta.json();

      throw new Error(
        datosError.mensaje ||
        "No tienes permisos para consultar usuarios"
      );
    }


    const datos =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.mensaje ||
        "No fue posible consultar los usuarios"
      );
    }


    tablaUsuarios.innerHTML =
      "";


    if (
      !datos.usuarios ||
      datos.usuarios.length === 0
    ) {

      cargandoUsuarios.innerHTML = `
        <div class="alert alert-info">
          No hay usuarios registrados.
        </div>
      `;

      return;
    }


    datos.usuarios.forEach(
      (usuario) => {

        const fila =
          document.createElement(
            "tr"
          );


        const estado =
          usuario.activo
            ? "Activo"
            : "Inactivo";


        const claseEstado =
          usuario.activo
            ? "text-bg-success"
            : "text-bg-secondary";


        const botonEstado =
          usuario.activo
            ? `
              <button
                type="button"
                class="btn btn-sm btn-outline-danger btn-estado"
                data-id="${usuario.id}"
                data-activo="false"
              >
                <i class="bi bi-person-x"></i>
                Desactivar
              </button>
            `
            : `
              <button
                type="button"
                class="btn btn-sm btn-outline-success btn-estado"
                data-id="${usuario.id}"
                data-activo="true"
              >
                <i class="bi bi-person-check"></i>
                Activar
              </button>
            `;


        fila.innerHTML = `
          <td>
            ${usuario.nombre}
          </td>

          <td>
            ${usuario.correo}
          </td>

          <td>
            ${usuario.bodega || "-"}
          </td>

          <td>
            <span
              class="badge ${
                usuario.rol === "ADMIN"
                  ? "text-bg-dark"
                  : "text-bg-primary"
              }"
            >
              ${usuario.rol}
            </span>
          </td>

          <td>
            <span
              class="badge ${claseEstado}"
            >
              ${estado}
            </span>
          </td>

          <td>

            <div
              class="d-flex gap-2 flex-wrap"
            >

              <button
                type="button"
                class="btn btn-sm btn-outline-primary btn-editar-usuario"
                data-id="${usuario.id}"
                data-nombre="${usuario.nombre}"
                data-correo="${usuario.correo}"
                data-bodega="${usuario.bodega || ""}"
              >
                <i class="bi bi-pencil"></i>
                Editar
              </button>

              ${botonEstado}

            </div>

          </td>
        `;


        tablaUsuarios.appendChild(
          fila
        );
      }
    );


    cargandoUsuarios.classList.add(
      "d-none"
    );

    tablaUsuariosContenedor.classList.remove(
      "d-none"
    );


  } catch (error) {

    console.error(
      "Error cargando usuarios:",
      error
    );

    cargandoUsuarios.classList.remove(
      "d-none"
    );

    cargandoUsuarios.innerHTML = `
      <div class="alert alert-danger">
        ${error.message}
      </div>
    `;
  }
}


// ==============================
// NUEVO USUARIO
// ==============================

if (
  btnNuevoUsuario &&
  formNuevoUsuario
) {

  btnNuevoUsuario.addEventListener(
    "click",
    () => {

      formNuevoUsuario.reset();

      if (modalNuevoUsuario) {

        modalNuevoUsuario.show();

      } else {

        console.error(
          "No se encontró modalNuevoUsuario"
        );
      }
    }
  );
}


// ==============================
// GUARDAR NUEVO USUARIO
// ==============================

if (formNuevoUsuario) {

  formNuevoUsuario.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const nombre =
        document.getElementById(
          "nuevoNombre"
        );

      const correo =
        document.getElementById(
          "nuevoCorreo"
        );

      const password =
        document.getElementById(
          "nuevaPassword"
        );

      const bodega =
        document.getElementById(
          "nuevaBodega"
        );


      const datos = {

        nombre:
          nombre.value.trim(),

        correo:
          correo.value.trim(),

        password:
          password.value,

        bodega:
          bodega.value.trim() ||
          null
      };


      try {

        const respuesta =
          await fetch(
            `${API_URL}/api/admin/usuarios`,
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
            "No fue posible crear el usuario"
          );
        }


        alert(
          resultado.mensaje ||
          "Usuario creado correctamente"
        );


        if (modalNuevoUsuario) {
          modalNuevoUsuario.hide();
        }


        formNuevoUsuario.reset();

        await cargarUsuarios();


      } catch (error) {

        console.error(
          "Error creando usuario:",
          error
        );

        alert(
          error.message
        );
      }
    }
  );
}


// ==============================
// ABRIR MODAL EDITAR
// ==============================

if (tablaUsuarios) {

  tablaUsuarios.addEventListener(
    "click",
    (event) => {

      const boton =
        event.target.closest(
          ".btn-editar-usuario"
        );


      if (!boton) {
        return;
      }


      const editarUsuarioId =
        document.getElementById(
          "editarUsuarioId"
        );

      const editarNombre =
        document.getElementById(
          "editarNombre"
        );

      const editarCorreo =
        document.getElementById(
          "editarCorreo"
        );

      const editarBodega =
        document.getElementById(
          "editarBodega"
        );


      if (
        !editarUsuarioId ||
        !editarNombre ||
        !editarCorreo ||
        !editarBodega
      ) {

        console.error(
          "Faltan campos del modal Editar Usuario"
        );

        return;
      }


      editarUsuarioId.value =
        boton.dataset.id;

      editarNombre.value =
        boton.dataset.nombre;

      editarCorreo.value =
        boton.dataset.correo;

      editarBodega.value =
        boton.dataset.bodega;


      if (modalEditarUsuario) {

        modalEditarUsuario.show();

      } else {

        console.error(
          "No se encontró modalEditarUsuario"
        );
      }
    }
  );
}


// ==============================
// GUARDAR EDICIÓN
// ==============================

if (formEditarUsuario) {

  formEditarUsuario.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const editarUsuarioId =
        document.getElementById(
          "editarUsuarioId"
        );

      const editarNombre =
        document.getElementById(
          "editarNombre"
        );

      const editarCorreo =
        document.getElementById(
          "editarCorreo"
        );

      const editarBodega =
        document.getElementById(
          "editarBodega"
        );


      if (
        !editarUsuarioId ||
        !editarNombre ||
        !editarCorreo ||
        !editarBodega
      ) {

        alert(
          "No fue posible leer los datos del formulario"
        );

        return;
      }


      const id =
        editarUsuarioId.value;


      const datos = {

        nombre:
          editarNombre.value.trim(),

        correo:
          editarCorreo.value.trim(),

        bodega:
          editarBodega.value.trim() ||
          null
      };


      try {

        const respuesta =
          await fetch(
            `${API_URL}/api/admin/usuarios/${id}`,
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
            "No fue posible actualizar el usuario"
          );
        }


        alert(
          resultado.mensaje ||
          "Usuario actualizado correctamente"
        );


        if (modalEditarUsuario) {
          modalEditarUsuario.hide();
        }


        await cargarUsuarios();


      } catch (error) {

        console.error(
          "Error editando usuario:",
          error
        );

        alert(
          error.message
        );
      }
    }
  );
}


// ==============================
// ACTIVAR / DESACTIVAR
// ==============================

if (tablaUsuarios) {

  tablaUsuarios.addEventListener(
    "click",
    async (event) => {

      const boton =
        event.target.closest(
          ".btn-estado"
        );


      if (!boton) {
        return;
      }


      const id =
        boton.dataset.id;


      const activo =
        boton.dataset.activo ===
        "true";


      const textoAccion =
        activo
          ? "activar"
          : "desactivar";


      const confirmar =
        confirm(
          `¿Deseas ${textoAccion} este usuario?`
        );


      if (!confirmar) {
        return;
      }


      try {

        const respuesta =
          await fetch(
            `${API_URL}/api/admin/usuarios/${id}/estado`,
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
                  activo
                })
            }
          );


        const resultado =
          await respuesta.json();


        if (!respuesta.ok) {

          throw new Error(
            resultado.mensaje ||
            "No fue posible actualizar el usuario"
          );
        }


        alert(
          resultado.mensaje
        );


        await cargarUsuarios();


      } catch (error) {

        console.error(
          "Error actualizando usuario:",
          error
        );

        alert(
          error.message
        );
      }
    }
  );
}


// ==============================
// INICIAR
// ==============================

cargarUsuarios();