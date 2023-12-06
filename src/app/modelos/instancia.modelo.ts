import { Respuesta } from "./respuesta.modelo";

export class Instancia {
  id?: number;
  encuesta_id: any;
  fecha_inicio: Date;
  fecha_fin: Date;
  estudiante_codigo?: string;
  asignacion_id: any;
  respuestas?:Respuesta[];
  estado: string;

  constructor(
    id: number,
    encuesta_id: any,
    fecha_inicio: Date,
    fecha_fin: Date,
    estudiante_codigo: string,
    asignacion_id: any,
    respuestas:Respuesta[],
    estado: string
  ) {
    this.id = id;
    this.encuesta_id = encuesta_id;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.estudiante_codigo = estudiante_codigo;
    this.asignacion_id = asignacion_id;
    this.respuestas=respuestas;
    this.estado = estado;
  }
} 