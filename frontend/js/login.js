const loginForm = document.getElementById("loginForm");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const mensaje = document.getElementById("mensaje");
const btnLogin = document.getElementById("btnLogin");


const mostrarMensaje = (texto, tipo) => {
  mensaje.textContent = texto;
  mensaje.className = `alert alert-${tipo}`;
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const correo = correoInput.value.trim();
  const password = passwordInput.value;

  if (!correo || !password) {
    mostrarMensaje(
      "Debes ingresar el correo y la contraseña",
      "warning"
    );
    return;
  }

  try {
    btnLogin.disabled = true;
    btnLogin.textContent = "Ingresando...";

    mensaje.className = "alert d-none";

    const respuesta = await fetch(
  `${API_URL}/api/usuarios/login`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      correo,
      password
    })
  }
);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(
        datos.mensaje || "No fue posible iniciar sesión",
        "danger"
      );
      return;
    }

    localStorage.setItem("token", datos.token);
    localStorage.setItem(
      "usuario",
      JSON.stringify(datos.usuario)
    );

    mostrarMensaje(
  "Inicio de sesión exitoso",
  "success"
);
setTimeout(() => {
  window.location.href = "./dashboard.html";
}, 700);

    console.log("Usuario:", datos.usuario);
    console.log("Token guardado:", datos.token);

    // Más adelante redirigiremos al menú principal.
    // window.location.href = "./dashboard.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    mostrarMensaje(
      "No se pudo conectar con el servidor",
      "danger"
    );
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = "Iniciar sesión";
  }
});

// ========================================
// RECUPERACIÓN DE CONTRASEÑA
// ========================================


// ========================================
// ELEMENTOS
// ========================================

const modalRecuperarPassword =
  document.getElementById(
    "modalRecuperarPassword"
  );

const pasoCorreo =
  document.getElementById(
    "pasoCorreo"
  );

const pasoCodigo =
  document.getElementById(
    "pasoCodigo"
  );

const pasoNuevaPassword =
  document.getElementById(
    "pasoNuevaPassword"
  );

const correoRecuperacion =
  document.getElementById(
    "correoRecuperacion"
  );

const correoCodigo =
  document.getElementById(
    "correoCodigo"
  );

const codigoRecuperacion =
  document.getElementById(
    "codigoRecuperacion"
  );

const nuevaPasswordRecuperacion =
  document.getElementById(
    "nuevaPasswordRecuperacion"
  );

const confirmarPasswordRecuperacion =
  document.getElementById(
    "confirmarPasswordRecuperacion"
  );

const btnEnviarCodigo =
  document.getElementById(
    "btnEnviarCodigo"
  );

const btnVerificarCodigo =
  document.getElementById(
    "btnVerificarCodigo"
  );

const btnVolverCorreo =
  document.getElementById(
    "btnVolverCorreo"
  );

const btnRestablecerPassword =
  document.getElementById(
    "btnRestablecerPassword"
  );


// ========================================
// DATOS TEMPORALES
// ========================================

let correoRecuperacionActual = "";

let codigoRecuperacionActual = "";


// ========================================
// CAMBIAR PASO DEL MODAL
// ========================================

const mostrarPasoRecuperacion = (
  paso
) => {

  pasoCorreo.classList.add(
    "d-none"
  );

  pasoCodigo.classList.add(
    "d-none"
  );

  pasoNuevaPassword.classList.add(
    "d-none"
  );


  if (paso === 1) {

    pasoCorreo.classList.remove(
      "d-none"
    );

  }


  if (paso === 2) {

    pasoCodigo.classList.remove(
      "d-none"
    );

  }


  if (paso === 3) {

    pasoNuevaPassword.classList.remove(
      "d-none"
    );

  }

};


// ========================================
// VALIDAR FORMATO DE CORREO
// ========================================

const correoValido = (
  correo
) => {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(correo);

};


// ========================================
// PASO 1
// ENVIAR CÓDIGO
// ========================================

btnEnviarCodigo.addEventListener(
  "click",
  async () => {

    const correo =
      correoRecuperacion
        .value
        .trim()
        .toLowerCase();


    if (!correo) {

      await Swal.fire({

        icon: "warning",

        title:
          "Correo requerido",

        text:
          "Ingresa tu correo electrónico."

      });

      correoRecuperacion.focus();

      return;

    }


    if (!correoValido(correo)) {

      await Swal.fire({

        icon: "warning",

        title:
          "Correo no válido",

        text:
          "Ingresa un correo electrónico válido."

      });

      correoRecuperacion.focus();

      return;

    }


    const contenidoOriginal =
      btnEnviarCodigo.innerHTML;


    btnEnviarCodigo.disabled =
      true;


    btnEnviarCodigo.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-1"
      ></span>
      Enviando...
    `;


    try {

      const respuesta =
        await fetch(
          `${API_URL}/api/usuarios/recuperar-password`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({
                correo
              })

          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          "No se pudo procesar la solicitud"
        );

      }


      correoRecuperacionActual =
        correo;


      correoCodigo.textContent =
        correo;


      codigoRecuperacion.value =
        "";


      mostrarPasoRecuperacion(
        2
      );


      await Swal.fire({

        icon: "success",

        title:
          "Solicitud procesada",

        text:
          datos.mensaje ||
          "Si el correo está registrado, recibirás un código de recuperación.",

        confirmButtonText:
          "Aceptar"

      });


      codigoRecuperacion.focus();


    } catch (error) {

      console.error(
        "Error solicitando recuperación:",
        error
      );


      await Swal.fire({

        icon: "error",

        title:
          "No se pudo enviar el código",

        text:
          error.message ||
          "Ocurrió un error inesperado."

      });


    } finally {

      btnEnviarCodigo.disabled =
        false;


      btnEnviarCodigo.innerHTML =
        contenidoOriginal;

    }

  }
);


// ========================================
// SOLO NÚMEROS EN EL CÓDIGO
// ========================================

codigoRecuperacion.addEventListener(
  "input",
  () => {

    codigoRecuperacion.value =
      codigoRecuperacion
        .value
        .replace(/\D/g, "")
        .slice(0, 6);

  }
);


// ========================================
// PASO 2
// VERIFICAR CÓDIGO
// ========================================

btnVerificarCodigo.addEventListener(
  "click",
  async () => {

    const codigo =
      codigoRecuperacion
        .value
        .trim();


    if (
      codigo.length !== 6
    ) {

      await Swal.fire({

        icon: "warning",

        title:
          "Código incompleto",

        text:
          "Ingresa el código de 6 dígitos."

      });

      codigoRecuperacion.focus();

      return;

    }


    const contenidoOriginal =
      btnVerificarCodigo.innerHTML;


    btnVerificarCodigo.disabled =
      true;


    btnVerificarCodigo.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-1"
      ></span>
      Verificando...
    `;


    try {

      const respuesta =
        await fetch(
          `${API_URL}/api/usuarios/verificar-codigo`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({

                correo:
                  correoRecuperacionActual,

                codigo

              })

          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          "El código no es válido"
        );

      }


      codigoRecuperacionActual =
        codigo;


      mostrarPasoRecuperacion(
        3
      );


      nuevaPasswordRecuperacion
        .focus();


    } catch (error) {

      console.error(
        "Error verificando código:",
        error
      );


      await Swal.fire({

        icon: "error",

        title:
          "Código incorrecto",

        text:
          error.message ||
          "El código es inválido o ha expirado."

      });


    } finally {

      btnVerificarCodigo.disabled =
        false;


      btnVerificarCodigo.innerHTML =
        contenidoOriginal;

    }

  }
);


// ========================================
// VOLVER A INGRESAR CORREO
// ========================================

btnVolverCorreo.addEventListener(
  "click",
  () => {

    codigoRecuperacionActual =
      "";


    codigoRecuperacion.value =
      "";


    mostrarPasoRecuperacion(
      1
    );


    correoRecuperacion.focus();

  }
);


// ========================================
// PASO 3
// RESTABLECER CONTRASEÑA
// ========================================

btnRestablecerPassword.addEventListener(
  "click",
  async () => {

    const nuevaPassword =
      nuevaPasswordRecuperacion.value;


    const confirmarPassword =
      confirmarPasswordRecuperacion.value;


    if (
      !nuevaPassword ||
      !confirmarPassword
    ) {

      await Swal.fire({

        icon: "warning",

        title:
          "Campos incompletos",

        text:
          "Ingresa y confirma tu nueva contraseña."

      });

      return;

    }


    if (
      nuevaPassword.length < 6
    ) {

      await Swal.fire({

        icon: "warning",

        title:
          "Contraseña muy corta",

        text:
          "La nueva contraseña debe contener al menos 6 caracteres."

      });

      nuevaPasswordRecuperacion
        .focus();

      return;

    }


    if (
      nuevaPassword !==
      confirmarPassword
    ) {

      await Swal.fire({

        icon: "warning",

        title:
          "Las contraseñas no coinciden",

        text:
          "La nueva contraseña y su confirmación deben ser iguales."

      });

      confirmarPasswordRecuperacion
        .focus();

      return;

    }


    const contenidoOriginal =
      btnRestablecerPassword.innerHTML;


    btnRestablecerPassword.disabled =
      true;


    btnRestablecerPassword.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-1"
      ></span>
      Guardando...
    `;


    try {

      const respuesta =
        await fetch(
          `${API_URL}/api/usuarios/restablecer-password`,
          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({

                correo:
                  correoRecuperacionActual,

                codigo:
                  codigoRecuperacionActual,

                nuevaPassword

              })

          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          "No se pudo restablecer la contraseña"
        );

      }


      // =====================================
      // CERRAR MODAL
      // =====================================

      const instanciaModal =
        bootstrap.Modal.getInstance(
          modalRecuperarPassword
        );


      if (instanciaModal) {

        instanciaModal.hide();

      }


      // =====================================
      // COLOCAR CORREO EN LOGIN
      // =====================================

      correoInput.value =
        correoRecuperacionActual;


      passwordInput.value =
        "";


      // =====================================
      // MENSAJE DE ÉXITO
      // =====================================

      await Swal.fire({

        icon: "success",

        title:
          "Contraseña restablecida",

        text:
          "Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión.",

        confirmButtonText:
          "Iniciar sesión"

      });


      passwordInput.focus();


      // =====================================
      // LIMPIAR DATOS TEMPORALES
      // =====================================

      limpiarRecuperacion();


    } catch (error) {

      console.error(
        "Error restableciendo contraseña:",
        error
      );


      await Swal.fire({

        icon: "error",

        title:
          "No se pudo cambiar la contraseña",

        text:
          error.message ||
          "Ocurrió un error inesperado."

      });


    } finally {

      btnRestablecerPassword.disabled =
        false;


      btnRestablecerPassword.innerHTML =
        contenidoOriginal;

    }

  }
);


// ========================================
// LIMPIAR RECUPERACIÓN
// ========================================

function limpiarRecuperacion() {

  correoRecuperacionActual =
    "";

  codigoRecuperacionActual =
    "";


  correoRecuperacion.value =
    "";

  codigoRecuperacion.value =
    "";

  nuevaPasswordRecuperacion.value =
    "";

  confirmarPasswordRecuperacion.value =
    "";


  mostrarPasoRecuperacion(
    1
  );

}


// ========================================
// LIMPIAR AL CERRAR EL MODAL
// ========================================

modalRecuperarPassword.addEventListener(
  "hidden.bs.modal",
  () => {

    limpiarRecuperacion();

  }
);