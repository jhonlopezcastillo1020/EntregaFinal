import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { Estudiante } from 'src/app/modelos/estudiante.mode';
import { Instancia } from 'src/app/modelos/instancia.modelo';
import { Opcion } from 'src/app/modelos/opcion.modelo';
import { Pregunta } from 'src/app/modelos/pregunta.modelo';
import { Seccion } from 'src/app/modelos/seccion.model';
import { AuthService } from 'src/app/servicios/auth.service';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.sass']
})
export class SeccionComponent implements OnInit {
  seccions: Seccion[] = [];
  preguntas: Pregunta[] = [];
  opciones: Opcion[] = [];

  estudianteActual: Estudiante | undefined;
  encuestaActual: Encuesta | undefined;
  instanciaActual: Instancia | undefined;
  preguntasActual:any;

  userid: any;

  id: any;
  subscription: Subscription | undefined;
  preguntaSeleccionada: any = null;


  @Output() evento = new EventEmitter<Pregunta>

  constructor(
    private aRouter: ActivatedRoute,
    private dbService: DbService<Seccion>,
    private preguntadbService: DbService<Pregunta>,
    private estudiantedbService: DbService<Estudiante>,
    private encuestadbService: DbService<Encuesta>,
    private instanciadbService: DbService<Instancia>,
    private authService: AuthService
  ) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.id = parseInt(this.id, 10);

    if(this.id!==null){
      this.getUser();
      this.getEstudiante();
      this.getInstancia();
      this.getEncuesta();

    }
 
    this.getSecciones();
    this.getPreguntas();



  }

  ngOnInit() {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
 
      if(this.id!==null){
        this.getUser();
        this.getEstudiante();
        this.getInstancia();
        this.getEncuesta();
  
      }
   

      this.getSecciones();
      this.getPreguntas();

    })


  }

  getUser() {
    this.authService.userId$.subscribe(data => {
      this.userid = data;
    });
  }

  getInstancia() {
    this.instanciadbService.getAll('instancia').subscribe(data => {

      

      const instancia = data.find(ins => ins.estudiante_codigo === this.estudianteActual?.id);

      console.log(instancia);
      
      if (instancia) {

        this.instanciaActual = instancia;
        this.authService.setInstancia(instancia.id);
      }


    }, error => {
      console.error('Error al obtener estudiante', error);
    }

    )
  }
  getEncuesta() {
    this.encuestadbService.getAll('encuesta').subscribe(data => {


    ;
      

      const encuesta = data.find(encuesta => encuesta.id ===   parseInt(this.instanciaActual?.encuesta_id));
      console.log();
      
      if (encuesta) {
        this.encuestaActual = encuesta;
        this.authService.setEncuesta(encuesta.id);
      }


    }, error => {
      console.error('Error al obtener estudiante', error);
    }

    )
  }

  getEstudiante() {
    this.estudiantedbService.getAll('estudiante').subscribe(data => {

      

      const estudiante = data.find(est => est.usuario_id === this.userid);
      
      
      if (estudiante) {
        this.estudianteActual = estudiante;

      }


    }, error => {
      console.error('Error al obtener estudiante', error);
    }

    )
  }

  getSecciones() {
    this.dbService.getAll('seccion').subscribe({
      next: (data: Seccion[]) => {



        if (this.id) {
          this.seccions = data.filter(seccion => seccion.encuesta_id === this.id && seccion.estado === 'activo');
        } else {

          this.seccions = data.filter(seccion => seccion.estado === 'activo' && seccion.encuesta_id===this.encuestaActual?.id);
          this.authService.setSeccione(this.seccions);
        }

      },
      error: error => {
        console.error('Error al obtener secciones:', error);

      }
    }

    )
  }

  getPreguntas() {
    
    this.preguntadbService.getAll('pregunta').subscribe({
      next: (data: Pregunta[]) => {
console.log(data);

        this.preguntas = data;

      },
      error: error => {
        console.error('Error al obtener preguntas:', error);

      }
    }

    )
  }

  onPregunta(pregunta: Pregunta) {
    this.evento.emit(pregunta);
    this.preguntaSeleccionada = pregunta;
   

  }




}
