

export class Usuario {
    id?: any;
    nombre: string;
    correo: string;
    clave: string;
    estado: string;
    rol: string;

    constructor(id:any, nombre: string, correo: string, clave: string, estado: string, rol: string) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.clave = clave;
        this.estado = estado;
        this.rol = rol;
    }
}