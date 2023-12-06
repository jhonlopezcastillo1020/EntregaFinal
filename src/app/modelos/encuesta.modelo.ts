export class Encuesta {
    id?: number;
    titulo: string;
    descripcion: string;
    estado: string;

    constructor(id: number, titulo: string, estado: string, descripcion: string) {
        this.id = id;
        this.titulo = titulo;
        this.estado = estado;
        this.descripcion = descripcion;
        
    }
}