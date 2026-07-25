const loginForm = document.getElementById("loginForm");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const mensaje = document.getElementById("mensaje");
const btnLogin = document.getElementById("btnLogin");

const API_URL = "http://localhost:3000/api/usuarios/login";

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

    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correo,
        password
      })
    });

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