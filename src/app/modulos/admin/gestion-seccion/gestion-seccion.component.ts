import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { Seccion } from 'src/app/modelos/seccion.model';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-gestion-seccion',
  templateUrl: './gestion-seccion.component.html',
  styleUrls: ['./gestion-seccion.component.sass']
})
export class GestionSeccionComponent implements OnInit {
  isCollapsed: boolean = false;
  secciones: Seccion[] = [];
  encuestas: Encuesta[] = [];
  subscription: Subscription | undefined;



  constructor(
    public sidebarService: SidebarService,
    private modalService: ModalService,
    private dbService: DbService<Seccion>,
    private encuestadbService: DbService<Encuesta>
  ) {
    this.getSecciones();
    this.getEncuestas();
  }

  ngOnInit() {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getSecciones();
      this.getEncuestas();
    })

  }

  abrirModalSeccion() {
    this.modalService.abrirModal('modalSeccion');


  }

  abrirModalSeccionEdictar(id: any) {
    this.modalService.abrirModal('modalSeccion', id);


  }

  eliminarSeccion(id: any) {

    const confirmacion = confirm('¿Estás seguro de que quieres eliminar la seccion?');

    if (confirmacion) {
      this.dbService.delete('seccion', id).subscribe(
        () => {
          console.log('Seccion eliminada exitosamente.');
        },
        error => {
          console.error('Error al eliminar la seccion:', error);
        }
      );
    }
  }

  getSecciones() {
    this.dbService.getAll('seccion').subscribe({
      next: (data: Seccion[]) => {

        // console.log(data);
        this.secciones = data;

      },
      error: error => {
        console.error('Error al obtener secciones:', error);

      }
    }

    )
  }

  getEncuestas() {
    this.encuestadbService.getAll('encuesta').subscribe({
      next: (data: Encuesta[]) => {

        // console.log(data);
        this.encuestas = data;

      },
      error: error => {
        console.error('Error al obtener encuesta:', error);

      }
    }

    )
  }



  actualizarEstado(id: any) {
    const seccionActual = this.secciones.find(secc => secc.id === id);
    if (!seccionActual) return;

    const confirmacion = confirm(`¿Estás seguro de que quieres cambiar el estado de ${seccionActual.nombre}?`);

    if (confirmacion) {
      seccionActual.estado = this.invertirEstado(seccionActual.estado);

      this.dbService.update('seccion', id, seccionActual).subscribe(
        () => {
          console.log('Estado de la seccion actualizado exitosamente.');
        },
        error => {
          console.error('Error al actualizar el estado de la seccion:', error);
          alert('Error al actualizar el estado de la seccion.');
        }
      );
    }
  }

  private invertirEstado(estadoActual: string): string {
    // Suponiendo que los estados posibles son 'activo' e 'inactivo'
    return estadoActual === 'activo' ? 'inactivo' : 'activo';
  }




}
