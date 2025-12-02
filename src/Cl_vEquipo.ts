import Cl_mEquipo, { iEquipo, LISTA_ESTADOS, LISTA_LABORATORIOS } from "./Cl_mEquipo.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vEquipo extends Cl_vGeneral {
  // Elementos
  private vistaFormulario: HTMLElement; private lblTitulo: HTMLLabelElement;
  private inSerial: HTMLInputElement; private slLab: HTMLSelectElement; private inCpu: HTMLInputElement; 
  private inRam: HTMLInputElement; private slEstado: HTMLSelectElement; private inFila: HTMLInputElement; private inPuesto: HTMLInputElement;
  private btAceptar: HTMLButtonElement; private btGuardar: HTMLButtonElement; private btCancelar: HTMLButtonElement;

  private vistaConsultar: HTMLElement;
  private lblC_Lab: HTMLElement; private lblC_Serial: HTMLElement; private lblC_Cpu: HTMLElement; 
  private lblC_Ram: HTMLElement; private lblC_Estado: HTMLElement; private lblC_Fila: HTMLElement; private lblC_Puesto: HTMLElement;
  private btVolver: HTMLButtonElement;

  private opcion: opcionFicha = opcionFicha.add;
  private _id: number | null = null; 

  constructor() {
    super({ formName: "equipo" });

    this.vistaFormulario = document.getElementById("equipo") as HTMLElement;
    this.lblTitulo = document.getElementById("equipo_lblTitulo") as HTMLLabelElement;
    
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

    this.vistaConsultar = document.getElementById("consultar") as HTMLElement;
    this.lblC_Lab = document.getElementById("consultar_lblLab") as HTMLElement;
    this.lblC_Serial = document.getElementById("consultar_lblSerial") as HTMLElement;
    this.lblC_Cpu = document.getElementById("consultar_lblCpu") as HTMLElement;
    this.lblC_Ram = document.getElementById("consultar_lblRam") as HTMLElement;
    this.lblC_Estado = document.getElementById("consultar_lblEstado") as HTMLElement;
    this.lblC_Fila = document.getElementById("consultar_lblFila") as HTMLElement;
    this.lblC_Puesto = document.getElementById("consultar_lblPuesto") as HTMLElement;
    
    this.btVolver = document.getElementById("consultar_btVolver") as HTMLButtonElement;
    if(this.btVolver) this.btVolver.onclick = () => this.cerrar();
  }

  show({ ver, equipo, opcion }: { ver: boolean; equipo?: Cl_mEquipo; opcion?: opcionFicha }) {
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
    this.inSerial.value = ""; this.slLab.selectedIndex = 0; this.inCpu.value = ""; 
    this.inRam.value = ""; this.slEstado.selectedIndex = 0; this.inFila.value = ""; this.inPuesto.value = "";
  }

  llenarCampos(equipo: Cl_mEquipo) {
    this.inSerial.value = equipo.serial;
    this.slLab.value = equipo.lab;
    this.inCpu.value = equipo.cpu;
    this.inRam.value = String(equipo.ram);
    this.slEstado.value = equipo.estado;
    this.inFila.value = equipo.fila;
    this.inPuesto.value = equipo.puesto;
  }

  cerrar() {
    this.controlador!.activarVista({ vista: "dcyt" });
  }

  procesar(accion: opcionFicha) {
    const datos: iEquipo = {
      id: this._id, 
      creadoEl: null, alias: null,
      serial: this.inSerial.value,
      lab: this.slLab.value as any,
      cpu: this.inCpu.value,
      ram: Number(this.inRam.value), // CONVERSIÓN A NUMBER OBLIGATORIA
      estado: this.slEstado.value as any,
      fila: this.inFila.value,
      puesto: this.inPuesto.value
    };

    const callback = (error: string | boolean) => {
      if (error) alert("Error: " + error);
      else this.controlador!.activarVista({ vista: "dcyt" }); // REDIRECCIÓN AL ÉXITO
    };

    if (accion === opcionFicha.add) {
      this.controlador!.addEquipo({ dtEquipo: datos, callback });
    } else {
      this.controlador!.editEquipo({ dtEquipo: datos, callback });
    }
  }
}