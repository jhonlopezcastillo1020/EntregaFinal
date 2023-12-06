import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Estudiante } from 'src/app/modelos/estudiante.mode';
import { Institucion } from 'src/app/modelos/institucion.modelo';
import { Usuario } from 'src/app/modelos/usuario,model';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-modal-form-estudiante',
  templateUrl: './modal-form-estudiante.component.html',
  styleUrls: ['./modal-form-estudiante.component.sass']
})
export class ModalFormEstudianteComponent {
  Id!: number | null;
  title: string = 'Agregar';
  modalData: any;
  formularioEstudiante: FormGroup;

  usuarios: Usuario[] = [];
  instituciones: Institucion[] = [];
  estudiantes: Estudiante[] = [];


  subscription: Subscription | undefined;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dbService: DbService<Estudiante>,
    private institituciondbService: DbService<Institucion>,
    private usuariodbService: DbService<Usuario>
  ) {
    this.getEstudiantes();
    this.getUsuarios();
    this.getInstituciones();

    this.formularioEstudiante = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      estudiante: ['', [Validators.required]],
      institucion: ['', [Validators.required]],


    });
  }

  ngOnInit() {

    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getUsuarios();
      this.getInstituciones();
      this.getEstudiantes();
    })
    this.modalService.sharedId.subscribe(id => {
      this.Id = id;

      if (this.Id !== null) {
        this.title = 'Actualizar';
        this.loadDataForEdit();
      } else {
        this.title = 'Agregar';
        this.formularioEstudiante.reset();
        this.formularioEstudiante.patchValue({ estudiante: "", institucion: "" })

      }


    });


  }

  getUsuarios() {
    this.usuariodbService.getAll('usuario').subscribe({
      next: (data: Usuario[]) => {

        // console.log(data);
        this.usuarios = data.filter(u => u.rol === 'Estudiante' && u.estado === 'activo');

      },
      error: error => {
        console.error('Error al obtener usuarios:', error);

      }
    }

    )
  }
  getInstituciones() {
    this.institituciondbService.getAll('institucion').subscribe({
      next: (data: Institucion[]) => {

        // console.log(data);
        this.instituciones = data.filter(i => i.estado === 'activo');

      },
      error: error => {
        console.error('Error al obtener instituciones:', error);

      }
    }

    )
  }

  getEstudiantes() {
    this.dbService.getAll('estudiante').subscribe({
      next: (data: Estudiante[]) => {

        this.estudiantes = data

      },
      error: error => {
        console.error('Error al obtener datos:', error);

      }
    }

    )
  }

  onSubmit() {


    
    if (this.formularioEstudiante.valid) {

      
      const formData: Estudiante = {
        id: this.formularioEstudiante.value.codigo,
        usuario_id: parseInt(this.formularioEstudiante.value.estudiante ),
        institucion_id: parseInt(this.formularioEstudiante.value.institucion),

      }

      console.log(formData);
      


      const asignado = this.estudiantes.find(a => a.usuario_id === formData.usuario_id)

      const codigoVerificacion = this.estudiantes.find(e => e.id === formData.id)

      if (asignado) {

        alert("El estudiante seleccionado ya está registrado");
        return;

      }

      if (codigoVerificacion) {

        alert(`Ya existe un usuario registrar con el codigo ${formData.id}`);
        return;

      }

      if (this.Id !== null) {
        this.dbService.update('estudiante', this.Id, formData).subscribe(
          updatedData => {
            console.log('Estudiante actualizada:', updatedData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al actualizar:', error);
          }
        );


      } else {
        this.dbService.add('estudiante', formData).subscribe(
          newData => {
            console.log('Nuevo Estudiante registrado:', newData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al registrar la nueva Estudiante:', error);
          }
        );

      }

    }

  }

  resetFormAndCloseModal() {
    this.formularioEstudiante.reset();
    this.modalService.cerrarModal();
  }

  loadDataForEdit() {

    this.dbService.getById('estudiante', this.Id!).subscribe(
      data => {
        this.formularioEstudiante.patchValue({
          codigo: data.id,
          estudiante: data.usuario_id,
          institucion: data.institucion_id,

        });
      },
      error => {
        console.error('Error al cargar datos para editar:', error);
      }
    );
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioEstudiante.get(controlName);
    return control?.hasError(errorType) || false;
  }

  isTouched(controlName: string): boolean {
    const control = this.formularioEstudiante.get(controlName);
    return control?.touched || false;
  }


}
