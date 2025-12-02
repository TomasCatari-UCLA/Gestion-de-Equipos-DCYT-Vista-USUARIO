import Cl_controlador from "./Cl_controlador.js";
import Cl_mDCYT from "./Cl_mDCYT.js";
import Cl_vUsuario from "./Cl_vUsuario.js";

export default class Cl_indexUser {
  constructor() {
    let modelo = new Cl_mDCYT();

    modelo.cargar((error: string | false) => {
      if (error) {
        alert("Error crítico cargando el sistema: " + error);
      }
      
      // Instanciamos la vista de USUARIO (solo lectura)
      let vista = new Cl_vUsuario();

      // Usamos 'as any' para que el controlador acepte esta nueva vista 
      // sin necesidad de modificar el archivo Cl_controlador.ts
      let controlador = new Cl_controlador(modelo, vista as any);
      
      vista.controlador = controlador;
      vista.refresh(); 
    });
  }
}