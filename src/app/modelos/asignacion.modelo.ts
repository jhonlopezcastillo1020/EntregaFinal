export class Asignacion {
    id?: any;
    usuario_id: number;
    institucion_id: number;
    estado:string;

    constructor(id: any, usuarioId: number, institucionId: number,estado:string) {
        this.id = id;
        this.usuario_id = usuarioId;
        this.institucion_id = institucionId;
        this.estado=estado;
    }
}