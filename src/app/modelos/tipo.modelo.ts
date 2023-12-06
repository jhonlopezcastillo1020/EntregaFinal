export class Tipo {
    id?: number;
    nombre: string;
    estado: string;

    constructor(id: number, nombre: string, estado: string) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
    }
}