// ========================================
// PERFIL - TECHASSIST
// ========================================


// ========================================
// SESIÓN
// ========================================

const token =
  localStorage.getItem("token");

const usuarioGuardado =
  localStorage.getItem("usuario");


if (!token || !usuarioGuardado) {

  window.location.href =
    "./login.html";

}


// ========================================
// ELEMENTOS
// ========================================

const nombreUsuario =
  document.getElementById("nombreUsuario");

const perfilNombrePrincipal =
  document.getElementById("perfilNombrePrincipal");

const perfilCorreoPrincipal =
  document.getElementById("perfilCorreoPrincipal");

const perfilRolBadge =
  document.getElementById("perfilRolBadge");

const perfilNombre =
  document.getElementById("perfilNombre");

const perfilCorreo =
  document.getElementById("perfilCorreo");

const perfilBodega =
  document.getElementById("perfilBodega");

const perfilRol =
  document.getElementById("perfilRol");

const perfilEstado =
  document.getElementById("perfilEstado");

const perfilFechaRegistro =
  document.getElementById("perfilFechaRegistro");


const menuAdministrarUsuarios =
  document.getElementById("menuAdministrarUsuarios");

const menuAdministrarRepuestos =
  document.getElementById("menuAdministrarRepuestos");


const btnMenu =
  document.getElementById("btnMenu");

const sidebar =
  document.getElementById("sidebar");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");


// ========================================
// CONTRASEÑA
// ========================================

const formCambiarPassword =
  document.getElementById("formCambiarPassword");

const passwordActual =
  document.getElementById("passwordActual");

const passwordNueva =
  document.getElementById("passwordNueva");

const confirmarPassword =
  document.getElementById("confirmarPassword");

const btnGuardarPassword =
  document.getElementById("btnGuardarPassword");

const btnVerPasswordActual =
  document.getElementById("btnVerPasswordActual");

const btnVerPasswordNueva =
  document.getElementById("btnVerPasswordNueva");

const btnVerConfirmarPassword =
  document.getElementById("btnVerConfirmarPassword");


// ========================================
// USUARIO LOCAL
// ========================================

let usuarioLocal = null;


try {

  usuarioLocal =
    JSON.parse(
      usuarioGuardado
    );


  nombreUsuario.textContent =
    usuarioLocal.nombre ||
    "Usuario";


  // Mostrar menús ADMIN

  if (
    usuarioLocal.rol === "ADMIN"
  ) {

    if (
      menuAdministrarUsuarios
    ) {

      menuAdministrarUsuarios
        .classList.remove(
          "d-none"
        );

    }


    if (
      menuAdministrarRepuestos
    ) {

      menuAdministrarRepuestos
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
// MENÚ RESPONSIVE
// ========================================

if (
  btnMenu &&
  sidebar
) {

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
// FORMATEAR FECHA
// ========================================

function formatearFecha(
  fecha
) {

  if (!fecha) {

    return "No disponible";

  }


  try {

    return new Intl.DateTimeFormat(
      "es-GT",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "America/Guatemala"
      }
    ).format(
      new Date(fecha)
    );


  } catch (error) {

    console.error(
      "Error formateando fecha:",
      error
    );


    return fecha;

  }

}


// ========================================
// MOSTRAR PERFIL
// ========================================

function mostrarPerfil(
  usuario
) {

  perfilNombrePrincipal.textContent =
    usuario.nombre ||
    "Usuario";


  perfilCorreoPrincipal.textContent =
    usuario.correo ||
    "Sin correo";


  perfilNombre.textContent =
    usuario.nombre ||
    "No especificado";


  perfilCorreo.textContent =
    usuario.correo ||
    "No especificado";


  perfilBodega.textContent =
    usuario.bodega ||
    "No asignada";


  perfilRol.textContent =
    usuario.rol ||
    "No especificado";


  perfilRolBadge.textContent =
    usuario.rol ||
    "USUARIO";


  // Color del rol

  perfilRolBadge.className =
    "badge";


  if (
    usuario.rol === "ADMIN"
  ) {

    perfilRolBadge.classList.add(
      "bg-danger"
    );

  } else {

    perfilRolBadge.classList.add(
      "bg-primary"
    );

  }


  // Estado

  if (
    usuario.activo === true
  ) {

    perfilEstado.innerHTML = `
      <span class="status-active">
        <i class="bi bi-check-circle-fill me-1"></i>
        Activo
      </span>
    `;

  } else {

    perfilEstado.innerHTML = `
      <span class="status-inactive">
        <i class="bi bi-x-circle-fill me-1"></i>
        Inactivo
      </span>
    `;

  }


  // Fecha

  perfilFechaRegistro.textContent =
    formatearFecha(
      usuario.fechaRegistro
    );

}


// ========================================
// CARGAR PERFIL DESDE BACKEND
// ========================================

async function cargarPerfil() {

  try {

    const respuesta =
      await fetch(
        `${API_URL}/api/usuarios/perfil`,
        {
          method: "GET",

          headers: {

            Authorization:
              `Bearer ${token}`

          }
        }
      );


    // TOKEN VENCIDO

    if (
      respuesta.status === 401 ||
      respuesta.status === 403
    ) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "usuario"
      );


      await Swal.fire({

        icon:
          "warning",

        title:
          "Sesión finalizada",

        text:
          "Inicia sesión nuevamente.",

        confirmButtonText:
          "Aceptar"

      });


      window.location.href =
        "./login.html";

      return;

    }


    const datos =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        datos.mensaje ||
        "No se pudo obtener el perfil"
      );

    }


    const usuario =
      datos.usuario;


    if (!usuario) {

      throw new Error(
        "No se recibió la información del usuario"
      );

    }


    mostrarPerfil(
      usuario
    );


    // =====================================
    // ACTUALIZAR LOCALSTORAGE
    // =====================================

    const usuarioActualizado = {

      ...usuarioLocal,

      id:
        usuario.id,

      nombre:
        usuario.nombre,

      correo:
        usuario.correo,

      bodega:
        usuario.bodega,

      rol:
        usuario.rol

    };


    localStorage.setItem(
      "usuario",
      JSON.stringify(
        usuarioActualizado
      )
    );


    usuarioLocal =
      usuarioActualizado;


    nombreUsuario.textContent =
      usuario.nombre;


  } catch (error) {

    console.error(
      "Error cargando perfil:",
      error
    );


    await Swal.fire({

      icon:
        "error",

      title:
        "No se pudo cargar el perfil",

      text:
        error.message ||
        "Ocurrió un error inesperado.",

      confirmButtonText:
        "Aceptar"

    });

  }

}


// ========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ========================================

function configurarMostrarPassword(
  boton,
  input
) {

  if (!boton || !input) {
    return;
  }


  boton.addEventListener(
    "click",
    () => {

      const mostrar =
        input.type ===
        "password";


      input.type =
        mostrar
          ? "text"
          : "password";


      const icono =
        boton.querySelector(
          "i"
        );


      if (icono) {

        icono.className =
          mostrar
            ? "bi bi-eye-slash"
            : "bi bi-eye";

      }

    }
  );

}


configurarMostrarPassword(
  btnVerPasswordActual,
  passwordActual
);


configurarMostrarPassword(
  btnVerPasswordNueva,
  passwordNueva
);


configurarMostrarPassword(
  btnVerConfirmarPassword,
  confirmarPassword
);


// ========================================
// LIMPIAR FORMULARIO PASSWORD
// ========================================

function limpiarFormularioPassword() {

  formCambiarPassword.reset();


  passwordActual.type =
    "password";

  passwordNueva.type =
    "password";

  confirmarPassword.type =
    "password";


  const botones = [

    btnVerPasswordActual,
    btnVerPasswordNueva,
    btnVerConfirmarPassword

  ];


  botones.forEach(
    boton => {

      const icono =
        boton?.querySelector(
          "i"
        );


      if (icono) {

        icono.className =
          "bi bi-eye";

      }

    }
  );

}


// ========================================
// CAMBIAR CONTRASEÑA
// ========================================

formCambiarPassword.addEventListener(
  "submit",
  async evento => {

    evento.preventDefault();


    const actual =
      passwordActual
        .value
        .trim();


    const nueva =
      passwordNueva
        .value
        .trim();


    const confirmar =
      confirmarPassword
        .value
        .trim();


    // =====================================
    // VALIDACIONES
    // =====================================

    if (
      !actual ||
      !nueva ||
      !confirmar
    ) {

      await Swal.fire({

        icon:
          "warning",

        title:
          "Campos incompletos",

        text:
          "Completa todos los campos."

      });

      return;

    }


    if (
      nueva.length < 6
    ) {

      await Swal.fire({

        icon:
          "warning",

        title:
          "Contraseña muy corta",

        text:
          "La nueva contraseña debe contener al menos 6 caracteres."

      });

      passwordNueva.focus();

      return;

    }


    if (
      nueva !== confirmar
    ) {

      await Swal.fire({

        icon:
          "warning",

        title:
          "Las contraseñas no coinciden",

        text:
          "La nueva contraseña y su confirmación deben ser iguales."

      });

      confirmarPassword.focus();

      return;

    }


    // =====================================
    // DESACTIVAR BOTÓN
    // =====================================

    const contenidoOriginal =
      btnGuardarPassword.innerHTML;


    btnGuardarPassword.disabled =
      true;


    btnGuardarPassword.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-1"
      ></span>

      Guardando...
    `;


    try {

      const respuesta =
        await fetch(
          `${API_URL}/api/usuarios/cambiar-password`,
          {

            method:
              "PUT",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },


            body:
              JSON.stringify({

                passwordActual:
                  actual,

                passwordNueva:
                  nueva

              })

          }
        );


      const datos =
        await respuesta.json();


      // TOKEN INVÁLIDO

      if (
        respuesta.status === 401 &&
        datos.mensaje !==
          "La contraseña actual es incorrecta"
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "usuario"
        );


        await Swal.fire({

          icon:
            "warning",

          title:
            "Sesión finalizada",

          text:
            "Inicia sesión nuevamente."

        });


        window.location.href =
          "./login.html";

        return;

      }


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          "No se pudo cambiar la contraseña"
        );

      }


      // =====================================
      // CERRAR MODAL
      // =====================================

      const modalElemento =
        document.getElementById(
          "modalCambiarPassword"
        );


      const modal =
        bootstrap.Modal.getInstance(
          modalElemento
        );


      if (modal) {

        modal.hide();

      }


      limpiarFormularioPassword();


      // =====================================
      // ÉXITO
      // =====================================

      await Swal.fire({

        icon:
          "success",

        title:
          "Contraseña actualizada",

        text:
          "Tu contraseña fue cambiada correctamente.",

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#198754"

      });


    } catch (error) {

      console.error(
        "Error cambiando contraseña:",
        error
      );


      await Swal.fire({

        icon:
          "error",

        title:
          "No se pudo cambiar la contraseña",

        text:
          error.message ||
          "Ocurrió un error inesperado.",

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#dc3545"

      });


    } finally {

      btnGuardarPassword.disabled =
        false;


      btnGuardarPassword.innerHTML =
        contenidoOriginal;

    }

  }
);


// ========================================
// LIMPIAR MODAL AL CERRAR
// ========================================

const modalCambiarPassword =
  document.getElementById(
    "modalCambiarPassword"
  );


if (modalCambiarPassword) {

  modalCambiarPassword.addEventListener(
    "hidden.bs.modal",
    () => {

      limpiarFormularioPassword();

    }
  );

}


// ========================================
// INICIAR
// ========================================

cargarPerfil();