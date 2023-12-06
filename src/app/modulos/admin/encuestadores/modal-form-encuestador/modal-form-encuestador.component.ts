import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Asignacion } from 'src/app/modelos/asignacion.modelo';
import { Institucion } from 'src/app/modelos/institucion.modelo';
import { Usuario } from 'src/app/modelos/usuario,model';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-modal-form-encuestador',
  templateUrl: './modal-form-encuestador.component.html',
  styleUrls: ['./modal-form-encuestador.component.sass']
})
export class ModalFormEncuestadorComponent implements OnInit {
  Id!: number | null;
  title: string = 'Agregar';
  modalData: any;
  formularioAsignar: FormGroup;
  edictEstado: any;

  usuarios: Usuario[] = [];
  instituciones: Institucion[] = [];
  asignados: Asignacion[] = [];

  subscription: Subscription | undefined;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dbService: DbService<Asignacion>,
    private institituciondbService: DbService<Institucion>,
    private usuariodbService: DbService<Usuario>
  ) {
    this.getAsignados();
    this.getUsuarios();
    this.getInstituciones();

    this.formularioAsignar = this.fb.group({

      encuestador: ['', [Validators.required]],
      institucion: ['', [Validators.required]],


    });
  }

  ngOnInit() {

    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getUsuarios();
      this.getInstituciones();
      this.getAsignados();
    })
    this.modalService.sharedId.subscribe(id => {
      this.Id = id;

      if (this.Id !== null) {
        this.title = 'Actualizar';
        this.loadDataForEdit();
      } else {
        this.title = 'Agregar';
        this.formularioAsignar.reset();
        this.formularioAsignar.patchValue({ encuestador: "", institucion: "" })

      }


    });


  }

  getUsuarios() {
    this.usuariodbService.getAll('usuario').subscribe({
      next: (data: Usuario[]) => {

        // console.log(data);
        this.usuarios = data.filter(u => u.rol === 'Encuestador' && u.estado === 'activo');

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

  getAsignados() {
    this.dbService.getAll('asignacion').subscribe({
      next: (data: Asignacion[]) => {

        this.asignados = data

      },
      error: error => {
        console.error('Error al obtener datos:', error);

      }
    }

    )
  }

  onSubmit() {

    if (this.formularioAsignar.valid) {
      const formData: Asignacion = {
        usuario_id: parseInt(this.formularioAsignar.value.encuestador),
        institucion_id: parseInt(this.formularioAsignar.value.institucion),
        estado: 'asignado',

      }



      const asignado = this.asignados.find(a => a.usuario_id === formData.usuario_id && a.estado === 'asignado')




      if (this.Id !== null) {
        formData.estado = this.edictEstado;

        this.dbService.update('asignacion', this.Id, formData).subscribe(
          updatedData => {
            console.log('Asignacion actualizada:', updatedData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al actualizar:', error);
          }
        );


      } else {
        if (asignado) {


          alert("El encuestador seleccionado ya está asignado add");
          return;

        }
        this.dbService.add('asignacion', formData).subscribe(
          newData => {
            console.log('Nuevo asignacion registrada:', newData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al registrar la nueva asignacion:', error);
          }
        );

      }

    }

  }

  resetFormAndCloseModal() {
    this.formularioAsignar.reset();
    this.modalService.cerrarModal();
  }

  loadDataForEdit() {

    this.dbService.getById('asignacion', this.Id!).subscribe(
      data => {
        this.formularioAsignar.patchValue({
          encuestador: data.usuario_id,
          institucion: data.institucion_id,

        });

        this.edictEstado = data.estado;
      },
      error => {
        console.error('Error al cargar datos para editar:', error);
      }
    );
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioAsignar.get(controlName);
    return control?.hasError(errorType) || false;
  }

  isTouched(controlName: string): boolean {
    const control = this.formularioAsignar.get(controlName);
    return control?.touched || false;
  }

}
