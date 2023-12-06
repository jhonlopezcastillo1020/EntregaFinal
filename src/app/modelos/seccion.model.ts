
export class Seccion {
    id?: any;
    nombre: string;
    estado: string;
    encuesta_id :number;


    constructor(id: any, nombre: string, estado: string, encuestaid: number) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
        this.encuesta_id = encuestaid

    }
}