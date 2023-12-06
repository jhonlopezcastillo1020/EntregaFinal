import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Asignacion } from 'src/app/modelos/asignacion.modelo';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { Estudiante } from 'src/app/modelos/estudiante.mode';
import { Instancia } from 'src/app/modelos/instancia.modelo';
import { AuthService } from 'src/app/servicios/auth.service';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-form-modal-instancia',
  templateUrl: './form-modal-instancia.component.html',
  styleUrls: ['./form-modal-instancia.component.sass']
})
export class FormModalInstanciaComponent implements OnInit {
  Id!: number | null;
  title: string = 'Agregar';

  modalData: any;
  formularioInstancia: FormGroup;
  edictEstado!: string;

  asignadoDatos!: Asignacion;

  edictAsignadoId!: any;
  subscription: Subscription | undefined;

  estudiantes: Estudiante[] = [];
  encuestas: Encuesta[] = [];
  instancias: Instancia[] = [];
  userid: any;


  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dbService: DbService<Instancia>,
    private authService: AuthService,
    private asignadodbService: DbService<Asignacion>,
    private estudiantedbService: DbService<Estudiante>,
    private encuestadbService: DbService<Encuesta>,
  ) {

    this.getUserId();
    this.getAsignacion();
    this.getEncuestas();
    this.getEstudiantes();
    this.getInstancias();


    this.formularioInstancia = this.fb.group({
      fechaFin: ['', [Validators.required]],
      estudiante: ['', [Validators.required]],
      encuesta: ['', [Validators.required]],


    });


  }




  ngOnInit() {

    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getUserId();
      this.getAsignacion();
      this.getEncuestas();
      this.getEstudiantes();
      this.getInstancias();
    })

    this.modalService.sharedId.subscribe(id => {
      this.Id = id;

      if (this.Id !== null) {
        this.title = 'Actualizar';
        this.loadDataForEdit();
      } else {
        this.title = 'Agregar';
        this.formularioInstancia.reset();
        this.formularioInstancia.patchValue({ estudiante: "", encuesta: "" })

      }


    });


  }

  getInstancias() {

    this.dbService.getAll('instancia').subscribe({
      next: (data: Instancia[]) => {
        this.instancias = data;
      },
      error: error => {
        console.error('Error al obtener estudiantes:', error);
      }
    });

  }

  getEstudiantes() {

    this.estudiantedbService.getAll('estudiante').subscribe({
      next: (data: Estudiante[]) => {
        this.estudiantes = data.filter(e => e.institucion_id === this.asignadoDatos.institucion_id);
      },
      error: error => {
        console.error('Error al obtener estudiantes:', error);
      }
    });

  }


  getEncuestas() {
    this.encuestadbService.getAll('encuesta').subscribe({
      next: (data: Encuesta[]) => {

        // console.log(data);
        this.encuestas = data.filter(f => f.estado === 'activo');

      },
      error: error => {
        console.error('Error al obtener encuesta:', error);

      }
    }

    )

  }

  getUserId() {
    this.authService.userId$.subscribe(id => {
      if (id !== null) {
        this.userid = id;
      }
    })
  }

  getAsignacion() {
    this.asignadodbService.getAll('asignacion').subscribe(data => {

      if (data.length > 0) {

        const datos = data.find(a => a.usuario_id === this.userid);
        if (datos) {
          this.asignadoDatos = datos;
        }
      }
    })

  }

  onSubmit() {

    if (this.formularioInstancia.valid) {
      const formData: Instancia = {
        encuesta_id: this.formularioInstancia.value.encuesta,
        fecha_inicio: new Date(),
        fecha_fin: new Date(this.formularioInstancia.value.fechaFin),
        asignacion_id: this.asignadoDatos.usuario_id,
        estudiante_codigo: this.formularioInstancia.value.estudiante,
        estado: 'abierta'
      }
      const estudiante = this.instancias.find(i => i.estudiante_codigo === formData.estudiante_codigo);



      if (this.Id !== null) {
        formData.estado = this.edictEstado;
        formData.asignacion_id = this.edictAsignadoId;

        if (this.edictEstado === 'cerrada') {
          alert("Esta instancia ya esta cerrada y no puede ser modificada");
          return
        }
        this.dbService.update('instancia', this.Id, formData).subscribe(
          updatedData => {
            console.log('Instancia actualizada:', updatedData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al actualizar la instancia:', error);
          }
        );


      } else {
        if (estudiante) {
          alert(`El estudiante ${estudiante.estudiante_codigo} ya tiene una encuesta en curso`)
          return
        }
        this.dbService.add('instancia', formData).subscribe(
          newInstancia => {
            console.log('Nuevo Instancia registrada:', newInstancia);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al registrar nuevo Instancia:', error);
          }
        );

      }

    }

  }

  resetFormAndCloseModal() {
    this.formularioInstancia.reset();
    this.modalService.cerrarModal();
  }

  loadDataForEdit() {

    this.dbService.getById('instancia', this.Id!).subscribe(
      data => {
        this.formularioInstancia.patchValue({

          fechaFin: this.formatFecha(data.fecha_fin),
          estudiante: data.estudiante_codigo,
          encuesta: data.encuesta_id

        });

        this.edictEstado = data.estado;
        this.edictAsignadoId = data.asignacion_id;
      },
      error => {
        console.error('Error al cargar datos para editar:', error);
      }
    );
  }
  formatFecha(fecha: any): string {
    const fechaDate = new Date(fecha);
    const yyyy = fechaDate.getFullYear();
    const MM = String(fechaDate.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaDate.getDate()).padStart(2, '0');
    const hh = String(fechaDate.getHours()).padStart(2, '0');
    const mm = String(fechaDate.getMinutes()).padStart(2, '0');

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  }


  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioInstancia.get(controlName);
    return control?.hasError(errorType) || false;
  }

  isTouched(controlName: string): boolean {
    const control = this.formularioInstancia.get(controlName);
    return control?.touched || false;
  }


}
