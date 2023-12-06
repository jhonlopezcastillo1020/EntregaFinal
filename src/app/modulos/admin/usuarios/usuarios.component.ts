import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/modelos/usuario,model';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.sass']
})
export class UsuariosComponent implements OnInit{

  isCollapsed: boolean = false;
  usuarios:Usuario[]=[];
  subscription: Subscription | undefined;
  

  constructor(
    public sidebarService: SidebarService,
    private modalService: ModalService,
    private dbService: DbService<Usuario>
    ) {this.getUsuarios();}

    ngOnInit() {
      this.subscription = this.dbService.dataRefresh$.subscribe(() => {
        this.getUsuarios();
      })
  
    }



    abrirModalUsuario() {
      this.modalService.abrirModal('modalUsuario');

      
    }

    abrirModalUsuarioEdictar(id:any) {
      this.modalService.abrirModal('modalUsuario',id);
     
      
    }

    
  eliminarusuario(id: any) {
    
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar la usuario?');

    if (confirmacion) {
      this.dbService.delete('usuario', id).subscribe(
        () => {
          console.log('usuario eliminada exitosamente.');
        },
        error => {
          console.error('Error al eliminar la usuario:', error);
        }
      );
    }
  }

  getUsuarios() {
    this.dbService.getAll('usuario').subscribe({
      next: (data: Usuario[]) => {

        // console.log(data);
        this.usuarios = data;

      },
      error: error => {
        console.error('Error al obtener usuarios:', error);

      }
    }

    )
  }

  
  actualizarEstado(id: any) {
    const usuarioActual = this.usuarios.find(secc => secc.id === id);
    if (!usuarioActual) return;
  
    const confirmacion = confirm(`¿Estás seguro de que quieres cambiar el estado de ${usuarioActual.nombre}?`);
    
    if (confirmacion) {
      usuarioActual.estado = this.invertirEstado(usuarioActual.estado);
  
      this.dbService.update('usuario', id, usuarioActual).subscribe(
        () => {
          console.log('Estado del usuario actualizado exitosamente.');
        },
        error => {
          console.error('Error al actualizar el estado del usuario:', error);
          alert('Error al actualizar el estado del usuario.');
        }
      );
    }
  }

  private invertirEstado(estadoActual: string): string {
    // Suponiendo que los estados posibles son 'activo' e 'inactivo'
    return estadoActual === 'activo' ? 'inactivo' : 'activo';
  }




}
