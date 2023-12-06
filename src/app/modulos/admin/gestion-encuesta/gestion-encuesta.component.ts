import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-gestion-encuesta',
  templateUrl: './gestion-encuesta.component.html',
  styleUrls: ['./gestion-encuesta.component.sass']
})
export class GestionEncuestaComponent {

  isCollapsed: boolean = false;
  encuestas:Encuesta[]=[];
  subscription: Subscription | undefined;
  

  constructor(
    public sidebarService: SidebarService,
    private modalService: ModalService,
    public dbService: DbService<Encuesta>
    ) {this.getEncuestas(); }

    ngOnInit() {
      this.subscription = this.dbService.dataRefresh$.subscribe(() => {
        this.getEncuestas();
      })
  
  
    }

    abrirModalEncuesta() {
      this.modalService.abrirModal('modalEncuesta');

      
    }

    abrirModalEncuestaEdictar(id:any) {
      this.modalService.abrirModal('modalEncuesta',id);
     
      
    }


    
  eliminarEncuesta(id: any) {
    
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar esta encuesta?');

    if (confirmacion) {
      this.dbService.delete('encuesta', id).subscribe(
        () => {
          console.log('Encuesta eliminada exitosamente.');
        },
        error => {
          console.error('Error al eliminar la encuesta:', error);
        }
      );
    }
  }



    
  getEncuestas() {
    this.dbService.getAll('encuesta').subscribe({
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
      const institucionActual = this.encuestas.find(encu => encu.id === id);
      if (!institucionActual) return;
    
      const confirmacion = confirm(`¿Estás seguro de que quieres cambiar el estado de ${institucionActual.titulo}?`);
      
      if (confirmacion) {
        institucionActual.estado = this.invertirEstado(institucionActual.estado);
    
        this.dbService.update('encuesta', id, institucionActual).subscribe(
          () => {
            console.log('Estado de la encuesta actualizado exitosamente.');
          },
          error => {
            console.error('Error al actualizar el estado de la encuesta:', error);
            alert('Error al actualizar el estado de la encuesta.');
          }
        );
      }
    }
  
    private invertirEstado(estadoActual: string): string {
      // Suponiendo que los estados posibles son 'activo' e 'inactivo'
      return estadoActual === 'activo' ? 'inactivo' : 'activo';
    }



}
