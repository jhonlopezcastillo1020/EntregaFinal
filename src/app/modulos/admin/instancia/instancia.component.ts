import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asignacion } from 'src/app/modelos/asignacion.modelo';
import { Instancia } from 'src/app/modelos/instancia.modelo';
import { AuthService } from 'src/app/servicios/auth.service';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-instancia',
  templateUrl: './instancia.component.html',
  styleUrls: ['./instancia.component.sass']
})
export class InstanciaComponent {
  isCollapsed: boolean = false;

  instancias: Instancia[] = [];
  subscription: Subscription | undefined;
  asignacion!: Asignacion;

  constructor(
    public sidebarService: SidebarService,
    private modalService: ModalService,
    private asignadodbService: DbService<Asignacion>,
    private dbService: DbService<Instancia>,
    private authService: AuthService
  ) {
    this.getUserActualAsignacion();
    this.getInstancias();
  }


  ngOnInit() {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getUserActualAsignacion();
      this.getInstancias();


    })


  }
  getUserActualAsignacion() {
    this.authService.userId$.subscribe(id => {
      console.log(id);
      
      if (id !== null) {
        this.asignadodbService.getAll('asignacion').subscribe(data => {
          const asignados = data.find(asig => asig.usuario_id === id);
  
          if (asignados) {
            this.asignacion =asignados;
            
          }
        });
      }
    });
  }

  abrirModalinstancia() {


    this.modalService.abrirModal('modalInstancia');


  }

  abrirModalinstanciaEdictar(id: any) {
    this.modalService.abrirModal('modalInstancia', id);


  }


  eliminarInstancia(id: any) {

    const confirmacion = confirm('¿Estás seguro de que quieres eliminar esta institancia?');

    if (confirmacion) {
      this.dbService.delete('instancia', id).subscribe(
        () => {
          console.log('Instancia eliminada exitosamente.');
        },
        error => {
          console.error('Error al eliminar la instancia:', error);
        }
      );
    }
  }

  getInstancias() {
    this.dbService.getAll('instancia').subscribe({
      next: (data: Instancia[]) => {


        // console.log(data);
        this.instancias = data.filter(ins => ins.asignacion_id === this.asignacion.usuario_id);

      },
      error: error => {
        console.error('Error al obtener instancias:', error);

      }
    }

    )
  }

  actualizarEstado(id: any) {
    const instanciaActual = this.instancias.find(inst => inst.id === id);
    if (!instanciaActual) return;

    const confirmacion = confirm(`¿Estás seguro de que quieres cambiar el estado de esta instancia`);

    if (confirmacion) {
      instanciaActual.estado = this.invertirEstado(instanciaActual.estado);

      this.dbService.update('instancia', id, instanciaActual).subscribe(
        () => {
          console.log('Estado de la institancia actualizado exitosamente.');
        },
        error => {
          console.error('Error al actualizar el estado de la instancia:', error);
          alert('Error al actualizar el estado de la instancia.');
        }
      );
    }
  }

  private invertirEstado(estadoActual: string): string {
    // Suponiendo que los estados posibles son 'activo' e 'inactivo'
    return estadoActual === 'abierta' ? 'cerrada' : 'abierta';
  }


}
