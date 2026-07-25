const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

const nombreUsuario = document.getElementById("nombreUsuario");
const nombreBienvenida = document.getElementById("nombreBienvenida");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const btnMenu = document.getElementById("btnMenu");
const sidebar = document.getElementById("sidebar");

if (!token || !usuarioGuardado) {
  window.location.href = "./login.html";
} else {
  try {
    const usuario = JSON.parse(usuarioGuardado);

    nombreUsuario.textContent = usuario.nombre;
    nombreBienvenida.textContent = usuario.nombre;
  } catch (error) {
    console.error("No se pudieron leer los datos del usuario:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "./login.html";
  }
}

btnCerrarSesion.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "./login.html";
});

btnMenu.addEventListener("click", () => {
  sidebar.classList.toggle("visible");
});