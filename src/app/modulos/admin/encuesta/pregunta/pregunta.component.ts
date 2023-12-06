import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Instancia } from 'src/app/modelos/instancia.modelo';
import { Pregunta } from 'src/app/modelos/pregunta.modelo';
import { Seccion } from 'src/app/modelos/seccion.model';
import { AuthService } from 'src/app/servicios/auth.service';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.sass']
})
export class PreguntaComponent implements OnInit {

  @Input() pregunta: any;
  respuestaForm!: FormGroup;

  secciones: Seccion[] = [];
  preguntas: any[] = [];
  instanciaId: any;
  formControls: { [key: string]: FormControl } = {}; // Objeto para almacenar FormControl para cada pregunta
  subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private dbService: DbService<Pregunta>,
    private instanaciaDBService: DbService<Instancia>,
    private fb: FormBuilder,
    private router: Router,

  ) {
    this.initForm();
    this.getSeciones()
    this.getPreguntas();
    this.getInstancia();
  }

  ngOnInit(): void {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.initForm();
      this.getSeciones()
      this.getPreguntas();
      this.getInstancia();
    })

  }

  getSeciones() {
    this.authService.secciones$.subscribe(data => {
      if (data) {
        this.secciones = data;
      }
    });
  }

  getInstancia() {
    this.authService.instanciaId$.subscribe(data => {
      if (data) {
        this.instanciaId = data;
      }
    });
  }


  initForm() {
    // Inicializa el formulario con un control para la respuesta
    this.respuestaForm = this.fb.group({
      respuesta: [''],
    });

  }



  getPreguntas() {
    this.dbService.getAll('pregunta').subscribe(data => {
      // Filtrar preguntas según las secciones seleccionadas
      this.preguntas = data.filter(pregunta =>
        this.secciones.some(seccion => seccion.id === +pregunta.seccion_id)
      );

      this.crearFormControls();
    });
  }

  private crearFormControls() {


    // Limpiar formControls y el formulario antes de agregar nuevos
    this.formControls = {};
    this.respuestaForm = this.fb.group({});

    // Crear un FormControl para cada pregunta y agregarlo al formulario


    this.preguntas.forEach((pregunta) => {
      const formControl = new FormControl('');
      this.formControls[pregunta.id] = formControl;
  
      this.respuestaForm.addControl(`${pregunta.id}`, formControl);

    });
  }

  submit() {

    const objetoMapeado = Object.entries(this.respuestaForm.value).map(([id, respuesta]) => ({
      id: +id,
      respuesta
    }));

    const respuestas: any[] = objetoMapeado.map(element => ({
      texto_respuesta: element.respuesta,
      pregunta_id: element.id,
      instancia_id: this.instanciaId
    }));


    console.log(respuestas);
    this.instanaciaDBService.getById('instancia', this.instanciaId)
      .pipe(
        switchMap(instancia => {
          const updateInstancia: Instancia = {
            encuesta_id: instancia.encuesta_id,
            fecha_inicio: instancia.fecha_inicio,
            fecha_fin: instancia.fecha_fin,
            estudiante_codigo: '',
            estado: 'cerrada',
            respuestas: respuestas,
            asignacion_id: instancia.asignacion_id
          };

          // Realiza la actualización de la instancia aquí
          return this.instanaciaDBService.update('instancia', this.instanciaId, updateInstancia);
        })
      )
      .subscribe(
        updatedData => {
          console.log('Instancia actualizada:', updatedData);
          this.authService.setInstancia(null);
          this.authService.setEncuesta(null);
   
          this.router.navigate(['/manager']);
        },
        error => {
          console.error('Error al actualizar la instancia:', error);
        }
      );
  }

}


