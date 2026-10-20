// TechAssist: administración de días especiales
(() => {
  "use strict";
  const token = localStorage.getItem("token");
  const usuarioTexto = localStorage.getItem("usuario");
  if (!token || !usuarioTexto) { location.replace("./login.html"); return; }
  let usuario;
  try { usuario = JSON.parse(usuarioTexto); } catch { location.replace("./login.html"); return; }
  if (usuario.rol !== "ADMIN") { location.replace("./dashboard.html"); return; }
  const $ = id => document.getElementById(id);
  $("nombreUsuario").textContent = usuario.nombre || "Administrador";
  $("menuAdministrarUsuarios")?.classList.remove("d-none");
  $("menuAdministrarRepuestos")?.classList.remove("d-none");
  $("menuDiasEspeciales")?.classList.remove("d-none");
  $("btnMenu").addEventListener("click", () => $("sidebar").classList.toggle("visible"));
  $("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("token"); localStorage.removeItem("usuario"); location.replace("./login.html");
  });
  const url = `${API_URL}/api/dias-especiales`;
  let dias = [];
  let editandoId = null;
  const fechaISO = fecha => typeof fecha === "string" ? fecha.slice(0, 10) : "";
  const fechaLegible = fecha => {
    const valor = fechaISO(fecha);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "Fecha desconocida";
    const [anio, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${anio}`;
  };
  function mensaje(texto, tipo = "danger") {
    const el = $("mensajeEstado");
    el.className = `alert alert-${tipo}`;
    el.textContent = texto;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  async function solicitar(path = "", opciones = {}) {
    const respuesta = await fetch(url + path, {
      ...opciones,
      headers: { Authorization: `Bearer ${token}`, ...(opciones.body ? { "Content-Type": "application/json" } : {}), ...opciones.headers }
    });
    const texto = await respuesta.text();
    let datos;
    try { datos = texto ? JSON.parse(texto) : {}; }
    catch { throw new Error(`El servidor devolvió una respuesta no válida (HTTP ${respuesta.status}). Comprueba que el backend esté publicado.`); }
    if (respuesta.status === 401) {
      localStorage.removeItem("token"); localStorage.removeItem("usuario");
      location.replace("./login.html"); throw new Error("Sesión expirada");
    }
    if (!respuesta.ok) throw new Error(datos.mensaje || `Error HTTP ${respuesta.status}`);
    return datos;
  }
  async function cargar() {
    $("listaDias").textContent = "Cargando días especiales...";
    try {
      const datos = await solicitar("?todos=true");
      dias = Array.isArray(datos.diasEspeciales) ? datos.diasEspeciales : [];
      $("totalDias").textContent = dias.length;
      $("totalActivos").textContent = dias.filter(d => d.activo).length;
      renderizar();
    } catch (error) { $("listaDias").textContent = "No fue posible cargar los registros."; mensaje(error.message); }
  }
  function renderizar() {
    const texto = $("buscarDia").value.trim().toLowerCase();
    const estado = $("filtroEstado").value;
    const visibles = dias.filter(d => {
      if (estado === "activos" && !d.activo) return false;
      if (estado === "inactivos" && d.activo) return false;
      return `${d.nombre} ${fechaLegible(d.fecha)} ${fechaISO(d.fecha)}`.toLowerCase().includes(texto);
    });
    const contenedor = $("listaDias"); contenedor.replaceChildren();
    if (!visibles.length) { const p = document.createElement("p"); p.className = "text-secondary mb-0"; p.textContent = "No hay días especiales para mostrar."; contenedor.append(p); return; }
    for (const dia of visibles) {
      const item = document.createElement("div"); item.className = "dia-list-item";
      const cabecera = document.createElement("div"); cabecera.className = "d-flex justify-content-between align-items-start gap-2 mb-2";
      const info = document.createElement("div");
      const titulo = document.createElement("div"); titulo.className = "fw-semibold"; titulo.textContent = dia.nombre;
      const fecha = document.createElement("div"); fecha.className = "text-secondary small";
      fecha.textContent = `${fechaLegible(dia.fecha)} · ${dia.recurrente ? "Repetición anual" : "Fecha única"}`;
      info.append(titulo, fecha);
      const estado = document.createElement("span"); estado.className = `badge ${dia.activo ? "text-bg-success" : "text-bg-secondary"}`; estado.textContent = dia.activo ? "Activo" : "Inactivo";
      cabecera.append(info, estado); item.append(cabecera);
      if (dia.descripcion) { const descripcion = document.createElement("p"); descripcion.className = "text-secondary small mb-2"; descripcion.textContent = dia.descripcion; item.append(descripcion); }
      const acciones = document.createElement("div"); acciones.className = "dia-actions";
      const editar = document.createElement("button"); editar.type = "button"; editar.className = "btn btn-sm btn-outline-primary"; editar.textContent = "Editar"; editar.addEventListener("click", () => editarDia(dia)); acciones.append(editar);
      if (dia.activo) {
        const desactivar = document.createElement("button"); desactivar.type = "button"; desactivar.className = "btn btn-sm btn-outline-danger"; desactivar.textContent = "Desactivar";
        desactivar.addEventListener("click", () => desactivarDia(dia)); acciones.append(desactivar);
      }
      item.append(acciones); contenedor.append(item);
    }
  }
  function limpiar() {
    editandoId = null; $("formDia").reset(); $("activoDia").checked = true;
    $("tituloFormulario").textContent = "Registrar día especial";
    $("btnGuardar").innerHTML = '<i class="bi bi-check2-circle me-1"></i> Guardar';
    $("btnCancelar").classList.add("d-none");
  }
  function editarDia(dia) {
    editandoId = dia.id;
    $("fechaDia").value = fechaISO(dia.fecha); $("nombreDia").value = dia.nombre;
    $("descripcionDia").value = dia.descripcion || "";
    $("recurrenteDia").checked = Boolean(dia.recurrente); $("activoDia").checked = Boolean(dia.activo);
    $("tituloFormulario").textContent = "Editar día especial";
    $("btnGuardar").textContent = "Guardar cambios"; $("btnCancelar").classList.remove("d-none");
    $("formDia").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function desactivarDia(dia) {
    const confirmacion = await Swal.fire({ title: "¿Desactivar día especial?", text: dia.nombre, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, desactivar", cancelButtonText: "Cancelar" });
    if (!confirmacion.isConfirmed) return;
    try { await solicitar(`/${encodeURIComponent(dia.id)}`, { method: "DELETE" }); await cargar(); await Swal.fire("Desactivado", "El día especial quedó inactivo.", "success"); }
    catch (error) { mensaje(error.message); }
  }
  $("formDia").addEventListener("submit", async event => {
    event.preventDefault();
    if (!$("formDia").reportValidity()) return;
    const datos = {
      fecha: $("fechaDia").value, nombre: $("nombreDia").value.trim(),
      descripcion: $("descripcionDia").value.trim(), recurrente: $("recurrenteDia").checked, activo: $("activoDia").checked
    };
    const boton = $("btnGuardar"); boton.disabled = true;
    try {
      await solicitar(editandoId ? `/${encodeURIComponent(editandoId)}` : "", { method: editandoId ? "PUT" : "POST", body: JSON.stringify(datos) });
      limpiar(); await cargar(); await Swal.fire("Guardado", "Los cambios se guardaron correctamente.", "success");
    } catch (error) { mensaje(error.message); }
    finally { boton.disabled = false; }
  });
  $("btnCancelar").addEventListener("click", limpiar);
  $("btnActualizar").addEventListener("click", cargar);
  $("buscarDia").addEventListener("input", renderizar);
  $("filtroEstado").addEventListener("change", renderizar);
  cargar();
})();
