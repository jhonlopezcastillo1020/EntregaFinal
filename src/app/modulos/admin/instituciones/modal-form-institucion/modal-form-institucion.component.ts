import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Institucion } from 'src/app/modelos/institucion.modelo';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-modal-form-institucion',
  templateUrl: './modal-form-institucion.component.html',
  styleUrls: ['./modal-form-institucion.component.sass']
})
export class ModalFormInstitucionComponent implements OnInit {
  Id!: number | null;
  title: string = 'Agregar';

  modalData: any;
  formularioInstitucion: FormGroup;
  edictEstado: any;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dbService: DbService<Institucion>
  ) {
    this.formularioInstitucion = this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],

    });
  }

  ngOnInit() {
    this.modalService.sharedId.subscribe(id => {
      this.Id = id;

      if (this.Id !== null) {
        this.title = 'Actualizar';
        this.loadDataForEdit();
        
      } else {
        this.title = 'Agregar';
        this.formularioInstitucion.reset();
      }


    });


  }
  onSubmit() {
    if (this.formularioInstitucion.valid) {
      const formData: Institucion = {
        nombre: this.formularioInstitucion.value.nombre,
        direccion: this.formularioInstitucion.value.direccion,
        estado: 'activo'
      };

      if (this.Id !== null) {
        formData.estado=this.edictEstado;
        this.dbService.update('institucion', this.Id, formData).subscribe(
          updatedData => {
            console.log('Institución actualizada:', updatedData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al actualizar la institución:', error);
          }
        );
      } else {
        this.dbService.add('institucion', formData).subscribe(
          newInstitucion => {
            console.log('Nueva institución registrada:', newInstitucion);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al registrar la nueva institución:', error);
          }
        );
      }
    }
  }


  resetFormAndCloseModal() {
    this.formularioInstitucion.reset();
    this.modalService.cerrarModal();
  }

  loadDataForEdit() {
    // Si es una actualización, carga los datos de la institución para editar
    this.dbService.getById('institucion', this.Id!).subscribe(
      data => {
        this.formularioInstitucion.patchValue({
          nombre: data.nombre,
          direccion: data.direccion
        });
        this.edictEstado=data.estado;
      },
      error => {
        console.error('Error al cargar datos para editar:', error);
      }
    );
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioInstitucion.get(controlName);
    return control?.hasError(errorType) || false;
  }

  isTouched(controlName: string): boolean {
    const control = this.formularioInstitucion.get(controlName);
    return control?.touched || false;
  }

}
