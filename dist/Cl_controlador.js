export default class Cl_controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }
    // --- CRUD ---
    addEquipo({ dtEquipo, callback }) {
        this.modelo.addEquipo({ dtEquipo, callback });
    }
    editEquipo({ dtEquipo, callback }) {
        this.modelo.editEquipo({ dtEquipo, callback });
    }
    deleteEquipo({ serial, callback }) {
        this.modelo.deleteEquipo({ serial, callback });
    }
    // --- CONSULTAS ---
    equipo(serial) {
        return this.modelo.buscarEquipo(serial);
    }
    // CORRECCIÓN: Ordenar por Laboratorio y luego por Serial
    get dtEquipos() {
        let dtEquipos = this.modelo.dtEquipos();
        dtEquipos.sort((a, b) => {
            // 1. Primero comparamos los Laboratorios
            const comparacionLab = a.lab.localeCompare(b.lab);
            // Si los laboratorios son diferentes, retornamos ese orden
            if (comparacionLab !== 0)
                return comparacionLab;
            // 2. Si son del mismo laboratorio, ordenamos por Serial (como desempate)
            return a.serial.localeCompare(b.serial);
        });
        return dtEquipos;
    }
    // --- NAVEGACIÓN ---
    activarVista({ vista, opcion, objeto }) {
        this.vista.activarVista({ vista, opcion, objeto });
    }
}
