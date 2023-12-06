import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';


@Component({
  selector: 'app-modal-form-encuesta',
  templateUrl: './modal-form-encuesta.component.html',
  styleUrls: ['./modal-form-encuesta.component.sass']
})
export class ModalFormEncuestaComponent implements OnInit {
  

  Id!: number | null;
  title:string= 'Agregar'


  modalData: any;
  formularioEncuesta: FormGroup;
  edictEstado: any;


  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dbService: DbService<Encuesta>,
  ) {
    this.formularioEncuesta = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
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
        this.formularioEncuesta.reset();
      }
    });
   



  }


  onSubmit() {

    if (this.formularioEncuesta.valid) {
      const formData:Encuesta ={
        titulo: this.formularioEncuesta.value.titulo,
        descripcion: this.formularioEncuesta.value.descripcion,
        estado: 'activo'
      } ;


    
      if (this.Id !== null) {
        formData.estado=this.edictEstado;
        this.dbService.update('encuesta', this.Id, formData).subscribe(
          updatedData => {
            console.log('Encuesta actualizada:', updatedData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al actualizar la encuesta:', error);
          }
        );


      } else {
        this.dbService.add('encuesta', formData).subscribe(
          newEncuesta => {
            console.log('Nueva encuesta registrada:', newEncuesta);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al registrar la nueva Encuesta:', error);
          }
        );

      }
   
    }

  }

  resetFormAndCloseModal(){
    this.formularioEncuesta.reset();
    this.modalService.cerrarModal();
  }

  loadDataForEdit() {
    
    this.dbService.getById('encuesta', this.Id!).subscribe(
      data => {
        this.formularioEncuesta.patchValue({
          titulo: data.titulo,
          descripcion:data.descripcion,
      
        
        });
        this.edictEstado=data.estado;
      },
      error => {
        console.error('Error al cargar datos para editar:', error);
      }
    );
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioEncuesta.get(controlName);
    return control?.hasError(errorType) || false;
  }

  isTouched(controlName: string): boolean {
    const control = this.formularioEncuesta.get(controlName);
    return control?.touched || false;
  }


}
