import { LISTA_ESTADOS, LISTA_LABORATORIOS } from "./Cl_mEquipo.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vEquipo extends Cl_vGeneral {
    constructor() {
        super({ formName: "equipo" });
        this.opcion = opcionFicha.add;
        this._id = null;
        this.vistaFormulario = document.getElementById("equipo");
        this.lblTitulo = document.getElementById("equipo_lblTitulo");
        this.inSerial = this.crearHTMLInputElement("inSerial");
        this.inCpu = this.crearHTMLInputElement("inCpu");
        this.inRam = this.crearHTMLInputElement("inRam");
        this.inFila = this.crearHTMLInputElement("inFila");
        this.inPuesto = this.crearHTMLInputElement("inPuesto");
        this.slLab = this.crearHTMLSelectElement("slLab", { elementsSource: LISTA_LABORATORIOS });
        this.slEstado = this.crearHTMLSelectElement("slEstado", { elementsSource: LISTA_ESTADOS });
        this.btAceptar = this.crearHTMLButtonElement("btAceptar", { onclick: () => this.procesar(opcionFicha.add) });
        this.btGuardar = this.crearHTMLButtonElement("btGuardar", { onclick: () => this.procesar(opcionFicha.edit) });
        this.btCancelar = this.crearHTMLButtonElement("btCancelar", { onclick: () => this.cerrar() });
        this.vistaConsultar = document.getElementById("consultar");
        this.lblC_Lab = document.getElementById("consultar_lblLab");
        this.lblC_Serial = document.getElementById("consultar_lblSerial");
        this.lblC_Cpu = document.getElementById("consultar_lblCpu");
        this.lblC_Ram = document.getElementById("consultar_lblRam");
        this.lblC_Estado = document.getElementById("consultar_lblEstado");
        this.lblC_Fila = document.getElementById("consultar_lblFila");
        this.lblC_Puesto = document.getElementById("consultar_lblPuesto");
        this.btVolver = document.getElementById("consultar_btVolver");
        if (this.btVolver)
            this.btVolver.onclick = () => this.cerrar();
    }
    show({ ver, equipo, opcion }) {
        this.vistaFormulario.style.display = "none";
        this.vistaConsultar.style.display = "none";
        if (ver && opcion !== undefined) {
            this.opcion = opcion;
            this.btAceptar.style.display = "none";
            this.btGuardar.style.display = "none";
            this.inSerial.disabled = false;
            if (this.opcion === opcionFicha.add) {
                this.vistaFormulario.style.display = "block";
                this.lblTitulo.innerText = "Agregar Equipo";
                this._id = null;
                this.btAceptar.style.display = "inline-block";
                this.limpiarCampos();
            }
            else if (this.opcion === opcionFicha.edit && equipo) {
                this.vistaFormulario.style.display = "block";
                this.lblTitulo.innerText = "Editar Equipo";
                this._id = equipo.id;
                this.btGuardar.style.display = "inline-block";
                this.llenarCampos(equipo);
                this.inSerial.disabled = true;
            }
            else if (this.opcion === opcionFicha.read && equipo) {
                this.vistaConsultar.style.display = "block";
                this.lblC_Lab.innerText = equipo.lab;
                this.lblC_Serial.innerText = equipo.serial;
                this.lblC_Cpu.innerText = equipo.cpu;
                this.lblC_Ram.innerText = String(equipo.ram);
                this.lblC_Estado.innerText = equipo.estado;
                this.lblC_Fila.innerText = equipo.fila;
                this.lblC_Puesto.innerText = equipo.puesto;
            }
        }
    }
    limpiarCampos() {
        this.inSerial.value = "";
        this.slLab.selectedIndex = 0;
        this.inCpu.value = "";
        this.inRam.value = "";
        this.slEstado.selectedIndex = 0;
        this.inFila.value = "";
        this.inPuesto.value = "";
    }
    llenarCampos(equipo) {
        this.inSerial.value = equipo.serial;
        this.slLab.value = equipo.lab;
        this.inCpu.value = equipo.cpu;
        this.inRam.value = String(equipo.ram);
        this.slEstado.value = equipo.estado;
        this.inFila.value = equipo.fila;
        this.inPuesto.value = equipo.puesto;
    }
    cerrar() {
        this.controlador.activarVista({ vista: "dcyt" });
    }
    procesar(accion) {
        const datos = {
            id: this._id,
            creadoEl: null, alias: null,
            serial: this.inSerial.value,
            lab: this.slLab.value,
            cpu: this.inCpu.value,
            ram: Number(this.inRam.value), // CONVERSIÓN A NUMBER OBLIGATORIA
            estado: this.slEstado.value,
            fila: this.inFila.value,
            puesto: this.inPuesto.value
        };
        const callback = (error) => {
            if (error)
                alert("Error: " + error);
            else
                this.controlador.activarVista({ vista: "dcyt" }); // REDIRECCIÓN AL ÉXITO
        };
        if (accion === opcionFicha.add) {
            this.controlador.addEquipo({ dtEquipo: datos, callback });
        }
        else {
            this.controlador.editEquipo({ dtEquipo: datos, callback });
        }
    }
}
