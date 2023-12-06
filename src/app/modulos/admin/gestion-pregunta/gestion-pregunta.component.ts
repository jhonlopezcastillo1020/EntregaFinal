import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { Opcion } from 'src/app/modelos/opcion.modelo';
import { Pregunta } from 'src/app/modelos/pregunta.modelo';
import { Seccion } from 'src/app/modelos/seccion.model';
import { DbService } from 'src/app/servicios/db.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-gestion-pregunta',
  templateUrl: './gestion-pregunta.component.html',
  styleUrls: ['./gestion-pregunta.component.sass']
})
export class GestionPreguntaComponent implements OnInit {
  crearPregunta: FormGroup;
  encuesta: Encuesta | null = null;
  secciones: Seccion[] = [];


  id: any;
  preguntaid: any;

  subscription: Subscription | undefined;



  constructor(
    public sidebarService: SidebarService,
    private dbService: DbService<Encuesta>,
    private secciondbService: DbService<Seccion>,
    private preguntadbService: DbService<Pregunta>,
    private fb: FormBuilder,
    private aRouter: ActivatedRoute,
  ) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.id = this.id ? parseInt(this.id, 10) : null;

    if (this.id !== null) {
      this.getByid();
      this.getSecciones();
    }


    this.crearPregunta = this.fb.group({
      texto: ['', Validators.required],
      seccion: ['', Validators.required],
      tipo: ['', Validators.required],
      opciones: this.fb.array([
        this.fb.control('')
      ])


    })


  }

  ngOnInit() {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {

      if (this.id !== null) {
        this.getByid();
        this.getSecciones();
      }
    })



  }

  getByid() {


    this.dbService.getById('encuesta', this.id!).subscribe(
      data => {
        this.encuesta = data;

      },
      error => {
        console.error('Error al cargar datos de la encuesta:', error);
      }
    );

  }

  getSecciones() {
    this.secciondbService.getAll('seccion').subscribe({
      next: (data: Seccion[]) => {


        this.secciones = data.filter(seccion => seccion.encuesta_id === this.id && seccion.estado === 'activo');

      },
      error: error => {
        console.error('Error al obtener secciones:', error);

      }
    }

    )
  }



  get opciones() {
    return this.crearPregunta.get('opciones') as FormArray;
  }


  toggleSidebar() {
    this.sidebarService.toggle();
  }

  agregarOpcion() {
    this.opciones.push(this.fb.control('', [Validators.required])); // Agregar una nueva opción vacía al arreglo

  }

  eliminarOpcion(index: number) {
    if (this.opciones.controls.length > 1) {


      this.opciones.removeAt(index);

    }
  }

  private asignarOpciones(): Opcion[] | null {
    const tipoPregunta = this.crearPregunta.value.tipo;

    if (tipoPregunta === 'multiple' && this.crearPregunta.value.opciones) {
      let idContador = 1;
      return this.crearPregunta.value.opciones.map((texto: any) => ({
        id: idContador++,
        texto: texto,
      }));
    }
    return null;
  }


  agregarPregunta() {
    if (this.crearPregunta.valid) {
      const opciones = this.asignarOpciones();

      const nuevaPregunta: Pregunta = {
        texto: this.crearPregunta.value.texto,
        seccion_id: this.crearPregunta.value.seccion,
        tipo: this.crearPregunta.value.tipo,
        opciones: opciones || [], // Usar opciones si existen, de lo contrario, un array vacío
        estado: 'activo',
      };


      this.preguntadbService.add('pregunta', nuevaPregunta).subscribe(
        (preguntaRegistrada) => {
          console.log('Pregunta registrada:', preguntaRegistrada);
          this.limpiarFormulario();
        },
        (error) => {
          console.error('Error al registrar la pregunta:', error);
        }
      );

    } else {
      console.error('Formulario no válido. Verifica los campos.');
    }
  }

  editarPregunta(id: number) {
    if (this.crearPregunta.valid) {
      const opcionesEditadas = this.asignarOpciones();

      const preguntaEditada: Pregunta = {
        texto: this.crearPregunta.value.texto,
        seccion_id: this.crearPregunta.value.seccion,
        tipo: this.crearPregunta.value.tipo,
        opciones: opcionesEditadas || [], // Usar opciones si existen, de lo contrario, un array vacío
        estado: 'activo',
      };



      this.preguntadbService.update('pregunta', id, preguntaEditada).subscribe(
        (preguntaActualizada) => {
          console.log('Pregunta actualizada:', preguntaActualizada);
          this.limpiarFormulario();
        },
        (error) => {
          console.error('Error al actualizar la pregunta:', error);
        }
      );
    } else {
      console.error('Formulario no válido. Verifica los campos.');
    }
  }

  eliminarPregunta(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      this.dbService.delete('pregunta', id).subscribe(
        () => {
          console.log('Pregunta eliminada exitosamente');

          this.limpiarFormulario();

        },
        (error) => {
          console.error('Error al eliminar la pregunta:', error);
        }
      );
    }
  }



  onPregunta(pregunta: Pregunta) {

    if (pregunta) {


      this.crearPregunta.patchValue({
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        seccion: pregunta.seccion_id,

      })



      this.preguntaid = pregunta.id;
      this.preguntaid = parseInt(this.preguntaid);

      // Manejar el FormArray de opciones
      const opcionesFormArray = this.crearPregunta.get('opciones') as FormArray;
      opcionesFormArray.clear(); // Limpiar el FormArray antes de agregar nuevas opciones

      if (pregunta.opciones && pregunta.opciones.length > 0) {
        pregunta.opciones.forEach((opcion: Opcion) => {
          opcionesFormArray.push(this.fb.control(opcion.texto, [Validators.required]));
        });
      }
    }
  }

  limpiarFormulario() {
    this.crearPregunta.reset();
    this.preguntaid = null;
    this.crearPregunta.patchValue({ tipo: "", seccion: "" })
  }

  getErrorMensajePregunta(): string {
    const preguntaControl = this.crearPregunta.get('texto');
    if (preguntaControl?.hasError('required') && (preguntaControl.dirty || preguntaControl.touched)) {
      return 'La pregunta es obligatoria.';
    }
    return '';
  }

  // Método para obtener mensajes de error del campo de sección
  getErrorMensajeSeccion(): string {
    const seccionControl = this.crearPregunta.get('seccion');
    if (seccionControl?.hasError('required') && (seccionControl.dirty || seccionControl.touched)) {
      return 'La sección es obligatoria.';
    }
    return '';
  }

  // Método para obtener mensajes de error del campo de tipo
  getErrorMensajeTipo(): string {
    const tipoControl = this.crearPregunta.get('tipo');
    if (tipoControl?.hasError('required') && (tipoControl.dirty || tipoControl.touched)) {
      return 'El tipo es obligatorio.';
    }
    return '';
  }


}
