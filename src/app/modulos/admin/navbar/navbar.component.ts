import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent  {

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    ) {}



  toggleSidebar() {
    this.sidebarService.toggle();
  }

  logout() {
    const success = this.authService.logout();

    // Manejar el resultado del cierre de sesión
    if (success) {
      // Realizar acciones después del cierre de sesión si es necesario
      this.router.navigate(['/']);
    } else {
      // Manejar el caso en el que no se pudo cerrar sesión (variables de sesión faltantes)
      console.error('No se pudo cerrar sesión');
    }
  }

}
