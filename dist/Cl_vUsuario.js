import { LISTA_ESTADOS, LISTA_LABORATORIOS } from "./Cl_mEquipo.js";
import Cl_vEquipo from "./Cl_vEquipo.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vUsuario extends Cl_vGeneral {
    constructor() {
        super({ formName: "dcyt" });
        // Reutilizamos vEquipo pero solo lo invocaremos en modo lectura
        this.vEquipo = new Cl_vEquipo();
        this.vEquipo.show({ ver: false });
        // Botones (SIN btAgregar)
        this.btBuscar = this.crearHTMLButtonElement("btBuscar", { onclick: () => this.abrirBusqueda(), });
        this.btQuitarFiltro = this.crearHTMLButtonElement("btQuitarFiltro", {
            onclick: () => this.limpiarFiltro(),
        });
        this.btQuitarFiltro.innerText = "* Quitar Filtro";
        this.divTabla = this.crearHTMLElement("divTabla", { type: tHTMLElement.CONTAINER, refresh: () => this.mostrarEquipos(), });
        // Stats labels
        this.lblTotal = document.getElementById("lblTotal");
        this.lblOperativos = document.getElementById("lblOperativos");
        this.lblReparacion = document.getElementById("lblReparacion");
        this.lblDañado = document.getElementById("lblDañado");
        // --- CONEXIÓN DE BÚSQUEDA ---
        this.modalBuscar = document.getElementById("modalBuscar");
        this.inBusSerial = document.getElementById("bus_inSerial");
        this.slBusLab = document.getElementById("bus_slLab");
        this.inBusCpu = document.getElementById("bus_inCpu");
        this.inBusRam = document.getElementById("bus_inRam");
        this.slBusEstado = document.getElementById("bus_slEstado");
        this.inBusFila = document.getElementById("bus_inFila");
        this.inBusPuesto = document.getElementById("bus_inPuesto");
        this.llenarSelectBusqueda(this.slBusLab, LISTA_LABORATORIOS);
        this.llenarSelectBusqueda(this.slBusEstado, LISTA_ESTADOS);
        this.btBuscarCancelar = document.getElementById("btBuscarCancelar");
        this.btBuscarCancelar.onclick = () => this.ocultarBusqueda();
        this.btBuscarAceptar = document.getElementById("btBuscarAceptar");
        this.btBuscarAceptar.onclick = () => this.ejecutarBusqueda();
    }
    set controlador(controlador) { super.controlador = controlador; this.vEquipo.controlador = controlador; }
    get controlador() { return super.controlador; }
    llenarSelectBusqueda(select, datos) {
        select.innerHTML = '<option value="">(Todos)</option>';
        datos.forEach(dato => {
            let option = document.createElement("option");
            option.value = dato;
            option.text = dato;
            select.add(option);
        });
    }
    mostrarEquipos(listaFiltrada) {
        var _a;
        this.divTabla.innerHTML = "";
        let equipos = listaFiltrada ? listaFiltrada : (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtEquipos;
        if (!equipos)
            return;
        // Manejo visual de botón "Quitar Filtro"
        if (listaFiltrada) {
            this.btQuitarFiltro.style.display = "flex";
        }
        else {
            this.btQuitarFiltro.style.display = "none";
        }
        // Actualizar Stats
        let listaParaStats = equipos;
        let total = listaParaStats.length;
        let operativos = listaParaStats.filter(e => e.estado === "Operativo").length;
        let reparacion = listaParaStats.filter(e => e.estado === "En Mantenimiento").length;
        let danado = listaParaStats.filter(e => e.estado === "Dañado").length;
        if (this.lblTotal)
            this.lblTotal.innerHTML = total.toString();
        if (this.lblOperativos)
            this.lblOperativos.innerHTML = operativos.toString();
        if (this.lblReparacion)
            this.lblReparacion.innerHTML = reparacion.toString();
        if (this.lblDañado)
            this.lblDañado.innerHTML = danado.toString();
        // Generar Tabla HTML (SOLO CON BOTÓN CONSULTAR)
        let html = "";
        if (equipos.length === 0)
            html = `<div style="text-align:center; padding:20px; color:#666;">No se encontraron resultados 🔍</div>`;
        equipos.forEach((equipo, index) => {
            let claseColor = "";
            if (equipo.estado === "Operativo")
                claseColor = "txt-green";
            if (equipo.estado === "En Mantenimiento")
                claseColor = "txt-yellow";
            if (equipo.estado === "Dañado")
                claseColor = "txt-red";
            html += `<div class="card">
                <div class="card-content">
                    <div class="card-title">${equipo.lab} Fila:${equipo.fila} Puesto:${equipo.puesto}</div>
                    <div class="card-detail"> <b>Serial:</b> ${equipo.serial || "N/A"} | <b> Equipo:</b> ${equipo.cpu} - <b> RAM:</b> ${equipo.ram}GB</div>
                    <div class="card-status ${claseColor}"><span class="status-dot">●</span> ${equipo.estado}</div>
                </div>
                <div class="card-actions">
                    <button class="action-link link-blue" id="dcyt_btConsultar_${index}"><span>👁️</span> Consultar</button>
                </div>
               </div>`;
        });
        this.divTabla.innerHTML = html;
        // Asignar eventos solo al botón Consultar
        equipos.forEach((equipo, index) => {
            let btnC = document.getElementById(`dcyt_btConsultar_${index}`);
            if (btnC)
                btnC.onclick = () => this.consultarEquipo(equipo.serial);
        });
    }
    // --- LÓGICA DE BÚSQUEDA (IDÉNTICA AL ADMIN) ---
    abrirBusqueda() {
        this.inBusSerial.value = "";
        this.inBusCpu.value = "";
        this.inBusRam.value = "";
        this.inBusFila.value = "";
        this.inBusPuesto.value = "";
        this.slBusLab.value = "";
        this.slBusEstado.value = "";
        this.modalBuscar.style.display = "flex";
    }
    ocultarBusqueda() { this.modalBuscar.style.display = "none"; }
    limpiarFiltro() { this.mostrarEquipos(); }
    ejecutarBusqueda() {
        var _a;
        let sSerial = this.inBusSerial.value.trim().toLowerCase();
        let sLab = this.slBusLab.value;
        let sCpu = this.inBusCpu.value.trim().toLowerCase();
        let sRam = this.inBusRam.value.trim();
        let sEstado = this.slBusEstado.value;
        let sFila = this.inBusFila.value.trim().toLowerCase();
        let sPuesto = this.inBusPuesto.value.trim().toLowerCase();
        let todos = ((_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtEquipos) || [];
        let filtrados = todos.filter((e) => {
            let coincide = true;
            if (sSerial && !e.serial.toLowerCase().includes(sSerial))
                coincide = false;
            if (sLab && e.lab !== sLab)
                coincide = false;
            if (sCpu && !e.cpu.toLowerCase().includes(sCpu))
                coincide = false;
            if (sRam && String(e.ram) !== sRam)
                coincide = false;
            if (sEstado && e.estado !== sEstado)
                coincide = false;
            if (sFila && e.fila.toLowerCase() !== sFila)
                coincide = false;
            if (sPuesto && e.puesto.toLowerCase() !== sPuesto)
                coincide = false;
            return coincide;
        });
        this.ocultarBusqueda();
        this.mostrarEquipos(filtrados);
    }
    // --- NAVEGACIÓN ---
    consultarEquipo(serial) {
        var _a, _b;
        let equipo = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.equipo(serial);
        if (equipo)
            (_b = this.controlador) === null || _b === void 0 ? void 0 : _b.activarVista({ vista: "equipo", opcion: opcionFicha.read, objeto: equipo, });
    }
    // Manejador de vistas simple para Usuario
    activarVista({ vista, opcion, objeto }) {
        if (vista === "dcyt") {
            this.show({ ver: true });
            this.mostrarEquipos(); // Refresca la tabla al volver
            this.vEquipo.show({ ver: false });
        }
        else {
            this.show({ ver: false });
            // Solo permitimos ver si es opcion READ, por seguridad, aunque la UI no permite otra cosa
            this.vEquipo.show({ ver: true, equipo: objeto, opcion: opcionFicha.read });
        }
    }
}
