export class Institucion {
    id?: number;
    nombre: string;
    direccion: string;
    estado: string;

    constructor(id: number, nombre: string, direccion: string, estado: string) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.estado = estado;
    }
}