
export class Estudiante {
    id: string;
    usuario_id: any;
    institucion_id: any;

    constructor(id: string, usuarioid: any, institucionid: any) {
        this.id = id;
        this.usuario_id = usuarioid;
        this.institucion_id = institucionid;
    }
}