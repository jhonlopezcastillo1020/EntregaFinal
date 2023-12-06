import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { GestionEncuestaComponent } from './gestion-encuesta/gestion-encuesta.component';
import { GestionPreguntaComponent } from './gestion-pregunta/gestion-pregunta.component';
import { GestionSeccionComponent } from './gestion-seccion/gestion-seccion.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InstitucionesComponent } from './instituciones/instituciones.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { EncuestadoresComponent } from './encuestadores/encuestadores.component';
import { InstanciaComponent } from './instancia/instancia.component';



const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'encuesta', component: EncuestaComponent },
  { path: 'gestionEncuesta', component: GestionEncuestaComponent },
  { path: 'gestionPregunta', component: GestionPreguntaComponent},
  { path: 'gestionSeccion', component: GestionSeccionComponent},
  { path: 'cuentas', component: UsuariosComponent},
  { path: 'institucion', component: InstitucionesComponent},
  { path: 'gestionPregunta/:id', component: GestionPreguntaComponent},
  { path: 'usuario/estudiantes', component: EstudiantesComponent},
  { path: 'usuario/encuestadores', component:EncuestadoresComponent},
  { path: 'instancia', component:InstanciaComponent},




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
