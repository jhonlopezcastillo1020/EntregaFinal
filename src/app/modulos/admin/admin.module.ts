import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { SeccionComponent } from './encuesta/seccion/seccion.component';
import { PreguntaComponent } from './encuesta/pregunta/pregunta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionPreguntaComponent } from './gestion-pregunta/gestion-pregunta.component';
import { GestionSeccionComponent } from './gestion-seccion/gestion-seccion.component';
import { GestionEncuestaComponent } from './gestion-encuesta/gestion-encuesta.component';
import { ModalFormSeccionComponent } from './gestion-seccion/modal-form-seccion/modal-form-seccion.component';
import { ModalFormEncuestaComponent } from './gestion-encuesta/modal-form-encuesta/modal-form-encuesta.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ModalFormUsuarioComponent } from './usuarios/modal-form-usuario/modal-form-usuario.component';
import { InstitucionesComponent } from './instituciones/instituciones.component';
import { ModalFormInstitucionComponent } from './instituciones/modal-form-institucion/modal-form-institucion.component';
import { EncuestadoresComponent } from './encuestadores/encuestadores.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { ModalFormEstudianteComponent } from './estudiantes/modal-form-estudiante/modal-form-estudiante.component';
import { ModalFormEncuestadorComponent } from './encuestadores/modal-form-encuestador/modal-form-encuestador.component';
import { InstanciaComponent } from './instancia/instancia.component';
import { FormModalInstanciaComponent } from './instancia/form-modal-instancia/form-modal-instancia.component';




@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    NavbarComponent,
    EncuestaComponent,
    SeccionComponent,
    PreguntaComponent,
    GestionPreguntaComponent,
    GestionSeccionComponent,
    GestionEncuestaComponent,
    ModalFormEncuestaComponent,
    ModalFormSeccionComponent,
    UsuariosComponent,
    ModalFormUsuarioComponent,
    InstitucionesComponent,
    ModalFormInstitucionComponent,
    EncuestadoresComponent,
    EstudiantesComponent,
    ModalFormEstudianteComponent,
    ModalFormEncuestadorComponent,
    InstanciaComponent,
    FormModalInstanciaComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
