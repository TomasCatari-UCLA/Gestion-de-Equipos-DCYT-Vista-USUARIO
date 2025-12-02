import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

// --- 1. LISTAS Y TIPOS ACTUALIZADOS ---
export type TipoLaboratorio = "Lab-01" | "Lab-02" | "Lab-03" | "Lab-04" | "Lab-05" | "Lab-06";
// CORRECCIÓN: Estados exactos solicitados por tu profesor
export type TipoEstado = "Operativo" | "En Mantenimiento" | "Dañado";

export const LISTA_LABORATORIOS: TipoLaboratorio[] = ["Lab-01", "Lab-02", "Lab-03", "Lab-04", "Lab-05", "Lab-06"];
export const LISTA_ESTADOS: TipoEstado[] = ["Operativo", "En Mantenimiento", "Dañado"];

// --- 2. INTERFAZ ACTUALIZADA ---
export interface iEquipo {
  id: number | null;
  creadoEl: string | null;
  alias: string | null;
  serial: string;
  lab: TipoLaboratorio;
  cpu: string;
  ram: number; // CORRECCIÓN: Ahora es number
  estado: TipoEstado;
  fila: string;
  puesto: string;
}

// --- 3. CLASE EQUIPO ---
export default class Cl_mEquipo extends Cl_mTablaWeb {
  private _serial: string = "";
  private _lab: TipoLaboratorio = "Lab-01";
  private _cpu: string = "";
  private _ram: number = 0; // Inicializado como número
  private _estado: TipoEstado = "Operativo";
  private _fila: string = "";
  private _puesto: string = "";

  constructor({ id, creadoEl, alias, serial, lab, cpu, ram, estado, fila, puesto }: iEquipo = {
      id: null, creadoEl: null, alias: null, 
      serial: "", lab: "Lab-01", cpu: "", ram: 0, estado: "Operativo", fila: "", puesto: ""
  }) {
    super({ id, creadoEl, alias });
    this.serial = serial;
    this.lab = lab;
    this.cpu = cpu;
    this.ram = ram;
    this.estado = estado;
    this.fila = fila;
    this.puesto = puesto;
  }

  // Setters y Getters (RAM maneja números)
  set serial(v: string) { this._serial = v.trim().toUpperCase(); }
  get serial(): string { return this._serial; }
  
  set lab(v: TipoLaboratorio) { this._lab = v; }
  get lab(): TipoLaboratorio { return this._lab; }
  
  set cpu(v: string) { this._cpu = v.trim(); }
  get cpu(): string { return this._cpu; }
  
  set ram(v: number) { this._ram = +v; } // Aseguramos conversión a número
  get ram(): number { return this._ram; }
  
  set estado(v: TipoEstado) { this._estado = v; }
  get estado(): TipoEstado { return this._estado; }
  
  set fila(v: string) { this._fila = v.trim(); }
  get fila(): string { return this._fila; }
  
  set puesto(v: string) { this._puesto = v.trim(); }
  get puesto(): string { return this._puesto; }

  // --- VALIDACIONES ESTRICTAS ---
  get serialOk(): boolean { return this._serial.length > 0 && this._serial.length <= 6; }
  get labOk(): boolean { return LISTA_LABORATORIOS.includes(this._lab); }
  get estadoOk(): boolean { return LISTA_ESTADOS.includes(this._estado); }
  get cpuOk(): boolean { return this._cpu.length > 0; }
  get ramOk(): boolean { return this._ram > 0; } // RAM debe ser mayor a 0
  get filaOk(): boolean { return this._fila.length > 0; }
  get puestoOk(): boolean { return this._puesto.length > 0; }

  get equipoOk(): string | true {
    if (!this.serialOk) return "Error: Serial inválido (vacío o >6 caracteres).";
    if (!this.labOk) return "Error: Laboratorio inválido.";
    if (!this.cpuOk) return "Error: CPU vacío.";
    if (!this.ramOk) return "Error: RAM inválida (debe ser número > 0).";
    if (!this.estadoOk) return "Error: Estado inválido.";
    if (!this.filaOk) return "Error: Fila vacía.";
    if (!this.puestoOk) return "Error: Puesto vacío.";
    return true;
  }

  toJSON(): iEquipo {
    return {
      ...super.toJSON(), // Hereda ID, creadoEl, alias
      serial: this._serial,
      lab: this._lab,
      cpu: this._cpu,
      ram: this._ram,
      estado: this._estado,
      fila: this._fila,
      puesto: this._puesto
    };
  }
}