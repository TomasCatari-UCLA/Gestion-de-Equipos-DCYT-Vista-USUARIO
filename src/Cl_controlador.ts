import Cl_mDCYT from "./Cl_mDCYT.js";
import Cl_vUsuario from "./Cl_vUsuario.js";
import Cl_mEquipo, { iEquipo } from "./Cl_mEquipo.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_controlador {
  public modelo: Cl_mDCYT;
  public vista: Cl_vUsuario;

  constructor(modelo: Cl_mDCYT, vista: Cl_vUsuario) {
    this.modelo = modelo;
    this.vista = vista;
  }

  // --- CRUD ---
  addEquipo({ dtEquipo, callback }: { dtEquipo: iEquipo; callback: (error: string | false) => void; }): void {
    this.modelo.addEquipo({ dtEquipo, callback });
  }

  editEquipo({ dtEquipo, callback }: { dtEquipo: iEquipo; callback: (error: string | boolean) => void; }): void {
    this.modelo.editEquipo({ dtEquipo, callback });
  }

  deleteEquipo({ serial, callback }: { serial: string; callback: (error: string | boolean) => void; }): void {
    this.modelo.deleteEquipo({ serial, callback });
  }

  // --- CONSULTAS ---
  equipo(serial: string): Cl_mEquipo | null {
    return this.modelo.buscarEquipo(serial);
  }

  // CORRECCIÓN: Ordenar por Laboratorio y luego por Serial
  get dtEquipos(): iEquipo[] {
    let dtEquipos = this.modelo.dtEquipos();
    
    dtEquipos.sort((a, b) => {
        // 1. Primero comparamos los Laboratorios
        const comparacionLab = a.lab.localeCompare(b.lab);
        
        // Si los laboratorios son diferentes, retornamos ese orden
        if (comparacionLab !== 0) return comparacionLab;
        
        // 2. Si son del mismo laboratorio, ordenamos por Serial (como desempate)
        return a.serial.localeCompare(b.serial);
    });
    
    return dtEquipos;
  }

  // --- NAVEGACIÓN ---
  activarVista({ vista, opcion, objeto }: { vista: string; opcion?: opcionFicha; objeto?: Cl_mEquipo; }): void {
    this.vista.activarVista({ vista, opcion, objeto });
  }
}