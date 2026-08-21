const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");

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
    }

    nombreUsuario.textContent =
      usuario.nombre;

  } catch (error) {

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

btnMenu.addEventListener(
  "click",
  () => {

    sidebar.classList.toggle(
      "visible"
    );
  }
);


// ==============================
// CERRAR SESIÓN
// ==============================

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


// ==============================
// CARGAR USUARIOS
// ==============================

async function cargarUsuarios() {

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

        const accion =
          usuario.activo
            ? `
              <button
                class="btn btn-sm btn-outline-danger btn-estado"
                data-id="${usuario.id}"
                data-activo="false"
              >
                Desactivar
              </button>
            `
            : `
              <button
                class="btn btn-sm btn-outline-success btn-estado"
                data-id="${usuario.id}"
                data-activo="true"
              >
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
            <span class="badge text-bg-primary">
              ${usuario.rol}
            </span>
          </td>

          <td>
            <span class="badge ${claseEstado}">
              ${estado}
            </span>
          </td>

          <td>
            ${accion}
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

const modalNuevoUsuario =
  bootstrap.Modal.getOrCreateInstance(
    modalNuevoUsuarioElemento
  );


btnNuevoUsuario.addEventListener(
  "click",
  () => {

    formNuevoUsuario.reset();

    modalNuevoUsuario.show();
  }
);


// ==============================
// GUARDAR USUARIO
// ==============================

formNuevoUsuario.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const datos = {

      nombre:
        document
          .getElementById(
            "nuevoNombre"
          )
          .value
          .trim(),

      correo:
        document
          .getElementById(
            "nuevoCorreo"
          )
          .value
          .trim(),

      password:
        document
          .getElementById(
            "nuevaPassword"
          )
          .value,

      bodega:
        document
          .getElementById(
            "nuevaBodega"
          )
          .value
          .trim()
          || null
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
        "Usuario creado correctamente"
      );

      modalNuevoUsuario.hide();

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


// ==============================
// ACTIVAR / DESACTIVAR
// ==============================

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


// ==============================
// INICIAR
// ==============================

cargarUsuarios();