import { Opcion } from "./opcion.modelo";


export class Pregunta {
    id?: number;
    texto: string;
    tipo: string;
    seccion_id: number;
    opciones?: Opcion[];
    estado: string;
    constructor(id: number, texto: string, estado: string, tipo: string, seccion_id: number, opciones: Opcion[]) {
        this.id = id;
        this.texto = texto;
        this.estado = estado;
        this.tipo = tipo;
        this.seccion_id = seccion_id;
        this.opciones=opciones
    }
}