import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Institucion } from 'src/app/modelos/institucion.modelo';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.sass']
})
export class InstitucionesComponent implements OnInit {
  isCollapsed: boolean = false;
  instituciones: Institucion[] = [];
  subscription: Subscription | undefined;

  constructor(
    public sidebarService: SidebarService,
    private modalService: ModalService,
    private dbService: DbService<Institucion>
  ) { this.getInstituciones(); }

  ngOnInit() {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getInstituciones();
    })


  }

  abrirModalInstitucion() {
    this.modalService.abrirModal('modalInstitucion');


  }

  abrirModalInstitucionEdictar(id: any) {
    this.modalService.abrirModal('modalInstitucion', id);


  }


  eliminarInstitucion(id: any) {
    
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar esta institución?');

    if (confirmacion) {
      this.dbService.delete('institucion', id).subscribe(
        () => {
          console.log('Institución eliminada exitosamente.');
        },
        error => {
          console.error('Error al eliminar la institución:', error);
        }
      );
    }
  }

  getInstituciones() {
    this.dbService.getAll('institucion').subscribe({
      next: (data: Institucion[]) => {

        // console.log(data);
        this.instituciones = data;

      },
      error: error => {
        console.error('Error al obtener instituciones:', error);

      }
    }

    )
  }

  actualizarEstado(id: any) {
    const institucionActual = this.instituciones.find(inst => inst.id === id);
    if (!institucionActual) return;
  
    const confirmacion = confirm(`¿Estás seguro de que quieres cambiar el estado de ${institucionActual.nombre}?`);
    
    if (confirmacion) {
      institucionActual.estado = this.invertirEstado(institucionActual.estado);
  
      this.dbService.update('institucion', id, institucionActual).subscribe(
        () => {
          console.log('Estado de la institución actualizado exitosamente.');
        },
        error => {
          console.error('Error al actualizar el estado de la institución:', error);
          alert('Error al actualizar el estado de la institución.');
        }
      );
    }
  }

  private invertirEstado(estadoActual: string): string {
    // Suponiendo que los estados posibles son 'activo' e 'inactivo'
    return estadoActual === 'activo' ? 'inactivo' : 'activo';
  }
}
