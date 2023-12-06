import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/servicios/modal.service';
import { DbService } from 'src/app/servicios/db.service';
import { Seccion } from 'src/app/modelos/seccion.model';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-modal-form-seccion',
  templateUrl: './modal-form-seccion.component.html',
  styleUrls: ['./modal-form-seccion.component.sass']
})
export class ModalFormSeccionComponent implements OnInit {

  Id!: number | null;
  title: string = 'Agregar';

  modalData: any;
  formularioSeccion: FormGroup;
  encuestas:Encuesta[]=[];
  subscription: Subscription | undefined;
  edictEstado: any;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dbService: DbService<Seccion>,
    private encuestadbService: DbService<Encuesta>
  ) {
    this.formularioSeccion = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(8)]],
      encuesta: ['', [Validators.required]],

    });
    this.getEncuestas(); 
  }

  ngOnInit() {
    this.modalService.sharedId.subscribe(id => {
      this.Id = id;

      if (this.Id !== null) {
        this.title = 'Actualizar';
        this.loadDataForEdit();

      } else {
        this.title = 'Agregar';
        this.formularioSeccion.reset();
        this.formularioSeccion.patchValue({encuesta:""});
      }


    });

    this.subscription = this.encuestadbService.dataRefresh$.subscribe(() => {
      this.getEncuestas();
    })


    
  }

  getEncuestas() {
    this.encuestadbService.getAll('encuesta').subscribe({
      next: (data: Encuesta[]) => {

        // console.log(data);
        
        this.encuestas = data.filter(encuesta => encuesta.estado === 'activo');

      },
      error: error => {
        console.error('Error al obtener encuesta:', error);

      }
    }

    )
  }

  onSubmit() {

    if (this.formularioSeccion.valid) {
      const formData: Seccion = {
        nombre: this.formularioSeccion.value.nombre,
        encuesta_id:parseInt(this.formularioSeccion.value.encuesta),
        estado: 'activo'
      };

      if (this.Id !== null) {
        formData.estado=this.edictEstado;
        this.dbService.update('seccion', this.Id, formData).subscribe(
          updatedData => {
            console.log('Seccion actualizada:', updatedData);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al actualizar la seccion:', error);
          }
        );


      } else {
        this.dbService.add('seccion', formData).subscribe(
          newSeccion => {
            console.log('Nueva seccion registrada:', newSeccion);
            this.resetFormAndCloseModal();
          },
          error => {
            console.error('Error al registrar la nueva seccion:', error);
          }
        );

      }



    }

  }

  resetFormAndCloseModal() {
    this.formularioSeccion.reset();
    this.modalService.cerrarModal();
  }

  loadDataForEdit() {
 
    this.dbService.getById('seccion', this.Id!).subscribe(
      data => {
        this.formularioSeccion.patchValue({
          nombre: data.nombre,
          encuesta:data.encuesta_id
        });
        this.edictEstado=data.estado;
      },
      error => {
        console.error('Error al cargar datos para editar:', error);
      }
    );
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formularioSeccion.get(controlName);
    return control?.hasError(errorType) || false;
  }

  isTouched(controlName: string): boolean {
    const control = this.formularioSeccion.get(controlName);
    return control?.touched || false;
  }


}
