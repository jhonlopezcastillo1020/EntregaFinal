

export class userInfo {

  nombre: string;
  rol: string;
  estado: string;

  constructor( nombre: string,estado: string, rol: string) {
      this.nombre = nombre;
      this.estado = estado;
      this.rol = rol;
  }
}
