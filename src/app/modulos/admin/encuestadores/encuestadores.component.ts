import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asignacion } from 'src/app/modelos/asignacion.modelo';
import { Institucion } from 'src/app/modelos/institucion.modelo';
import { Usuario } from 'src/app/modelos/usuario,model';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-encuestadores',
  templateUrl: './encuestadores.component.html',
  styleUrls: ['./encuestadores.component.sass']
})
export class EncuestadoresComponent implements OnInit {

  isCollapsed: boolean = false;
  usuarios: Usuario[] = [];
  instituciones: Institucion[] = [];
  asignaciones: Asignacion[] = [];
  subscription: Subscription | undefined;

  constructor(
    public sidebarService: SidebarService,
    private modalService: ModalService,
    private dbService: DbService<Asignacion>,
    private usuariodbService: DbService<Usuario>,
    private instituciondbService: DbService<Institucion>

  ) {

    this.getAsignaciones();
    this.getUsuarios();
    this.getInstituciones();
  }
  ngOnInit() {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getAsignaciones();
      this.getUsuarios();
      this.getInstituciones();
    })

  }

  abrirModal() {
    this.modalService.abrirModal('modalAsignacion');


  }

  abrirModalEdictar(id: any) {
    this.modalService.abrirModal('modalAsignacion', id);


  }

  eliminarAsignacion(id: any) {

    const confirmacion = confirm('¿Estás seguro de que quieres eliminar la asignacion?');

    if (confirmacion) {
      this.dbService.delete('asignacion', id).subscribe(
        () => {
          console.log('asignacion eliminada exitosamente.');
        },
        error => {
          console.error('Error al eliminar:', error);
        }
      );
    }
  }

  getAsignaciones() {
    this.dbService.getAll('asignacion').subscribe({
      next: (data: Asignacion[]) => {

        // console.log(data);
        this.asignaciones = data;

      },
      error: error => {
        console.error('Error al obtener asignados:', error);

      }
    }

    )
  }
  getUsuarios() {
    this.usuariodbService.getAll('usuario').subscribe({
      next: (data: Usuario[]) => {

        this.usuarios = data.filter(usuario => usuario.rol === 'Encuestador' && usuario.estado === 'activo');

      },
      error: error => {
        console.error('Error al obtener usuarios:', error);

      }
    }

    )
  }

  getInstituciones() {
    this.instituciondbService.getAll('institucion').subscribe({
      next: (data: Institucion[]) => {

        // console.log(data);
        this.instituciones = data.filter(institucion => institucion.estado === 'activo');

      },
      error: error => {
        console.error('Error al obtener instituciones:', error);

      }
    }

    )
  }

  actualizarEstado(id: any) {
    const asignacionActual = this.asignaciones.find(asig => asig.id === id);
    if (!asignacionActual) return;

    const confirmacion = confirm(`¿Estás seguro de que quieres cambiar el estado?`);

    if (confirmacion) {
      asignacionActual.estado = this.invertirEstado(asignacionActual.estado);

      this.dbService.update('asignacion', id, asignacionActual).subscribe(
        () => {
          console.log('Estado del usuario actualizado exitosamente.');
        },
        error => {
          console.error('Error al actualizar el estado:', error);
          alert('Error al actualizar el estado.');
        }
      );
    }
  }

  private invertirEstado(estadoActual: string): string {

    return estadoActual === 'asignado' ? 'completado' : 'asignado';
  }





}
