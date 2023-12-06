import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Estudiante } from 'src/app/modelos/estudiante.mode';
import { Institucion } from 'src/app/modelos/institucion.modelo';
import { Usuario } from 'src/app/modelos/usuario,model';
import { DbService } from 'src/app/servicios/db.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.sass']
})
export class EstudiantesComponent implements OnInit {

  isCollapsed: boolean = false;
  usuarios: Usuario[] = [];
  instituciones: Institucion[] = [];
  estudiantes: Estudiante[] = [];
  subscription: Subscription | undefined;

  constructor(
    public sidebarService: SidebarService,
    private modalService: ModalService,
    private dbService: DbService<Estudiante>,
    private usuariodbService: DbService<Usuario>,
    private instituciondbService: DbService<Institucion>

  ) {

    this.getEstudiantes();
    this.getUsuarios();
    this.getInstituciones();
  }
  ngOnInit() {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getEstudiantes();
      this.getUsuarios();
      this.getInstituciones();
    })

  }

  abrirModal() {
    this.modalService.abrirModal('modalEstudiante');


  }

  abrirModalEdictar(id: any) {
    this.modalService.abrirModal('modalEstudiante', id);


  }

  eliminarEstudiante(id: any) {

    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este estudiante?');

    if (confirmacion) {
      this.dbService.delete('estudiante', id).subscribe(
        () => {
          console.log('Estudiante eliminado exitosamente.');
        },
        error => {
          console.error('Error al eliminar:', error);
        }
      );
    }
  }

  getEstudiantes() {
    this.dbService.getAll('estudiante').subscribe({
      next: (data: Estudiante[]) => {

        // console.log(data);
        this.estudiantes = data;

      },
      error: error => {
        console.error('Error al obtener estudiantes:', error);

      }
    }

    )
  }
  getUsuarios() {
    this.usuariodbService.getAll('usuario').subscribe({
      next: (data: Usuario[]) => {

        this.usuarios = data.filter(usuario => usuario.rol === 'Estudiante' && usuario.estado === 'activo');

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




}
