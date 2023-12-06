import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/modelos/usuario,model';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-modal-form-usuario',
  templateUrl: './modal-form-usuario.component.html',
  styleUrls: ['./modal-form-usuario.component.sass']
})
export class ModalFormUsuarioComponent implements OnInit {
  Id!: number | null;
  title: string = 'Agregar';

  modalData: any;
  formularioUsuario: FormGroup;
  edictEstado!: string;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dbService: DbService<Usuario>
  ) {
    this.formularioUsuario = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', [Validators.required]],

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
        this.formularioUsuario.reset();
        this.formularioUsuario.patchValue({ rol: "" })

      }


    });


  }

  onSubmit() {

    if (this.formularioUsuario.valid) {
      const formData: Usuario = {
        nombre: this.formularioUsuario.value.nombre,
        correo: this.formularioUsuario.value.correo,
        clave: this.formularioUsuario.value.clave,
        estado: 'activo',
        rol: this.formularioUsuario.value.rol
      }


      if (this.Id !== null) {
        formData.estado=this.edictEstado;
        this.dbService.update('usuario', this.Id, formData).subscribe(
          updatedData => {
            console.log('Usuario actualizado:', updatedData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al actualizar la seccion:', error);
          }
        );


      } else {
        this.dbService.add('usuario', formData).subscribe(
          newUsuario => {
            console.log('Nuevo usuario registrado:', newUsuario);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al registrar nuevo usuario:', error);
          }
        );

      }

    }

  }

  resetFormAndCloseModal() {
    this.formularioUsuario.reset();
    this.modalService.cerrarModal();
  }

  loadDataForEdit() {
    
    this.dbService.getById('usuario', this.Id!).subscribe(
      data => {
        this.formularioUsuario.patchValue({
          nombre: data.nombre,
          correo:data.correo,
          clave:data.clave,
          rol:data.rol
        });
        this.edictEstado=data.estado;
      },
      error => {
        console.error('Error al cargar datos para editar:', error);
      }
    );
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioUsuario.get(controlName);
    return control?.hasError(errorType) || false;
  }

  isTouched(controlName: string): boolean {
    const control = this.formularioUsuario.get(controlName);
    return control?.touched || false;
  }

}
