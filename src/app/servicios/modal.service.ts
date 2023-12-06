import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private idSubject = new BehaviorSubject<number | null>(null);
  public sharedId = this.idSubject.asObservable();

  private modalSubject = new BehaviorSubject<bootstrap.Modal | null>(null);
  public modalInstacia = this.modalSubject.asObservable();



  constructor() { }

  abrirModal(modalId: string, id?: any) {
    const modalElement = document.getElementById(modalId);


    if (modalElement) {
      // Crear un nuevo modal
      const myModal = new window.bootstrap.Modal(modalElement, {});

      // Limpiar cualquier valor anterior
      this.idSubject.next(null);

      if (id) {
        console.log("se esta ejecutando esta");
        this.idSubject.next(id);
      }

      // Emitir la instancia del modal
      this.modalSubject.next(myModal);

      // Mostrar el modal
      myModal.show();

    }
  }

  cerrarModal() {

    this.modalInstacia.subscribe(modal => {
      if (modal) {
        modal.hide()

      }
    });
  }



}
