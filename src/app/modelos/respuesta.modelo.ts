export class Respuesta {
    id?: number;
    texto_respuesta: string;
    pregunta_id: number;
    instancia_id: number;
  
    constructor(id: number, texto_respuesta: string, pregunta_id: number, instancia_id: number) {
      this.id = id;
      this.texto_respuesta = texto_respuesta;
      this.pregunta_id = pregunta_id;
      this.instancia_id = instancia_id;
    }
  }