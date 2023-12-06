import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LocalstorageService } from './localstorage.service';
import { Usuario } from '../modelos/usuario,model';
import { DbService } from './db.service';
import { LoginResult } from '../modelos/login-result.enum';
import { Subscription } from 'rxjs';
import { Seccion } from '../modelos/seccion.model';


@Injectable({
  providedIn: 'root'
})


export class AuthService implements OnInit {
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private seccionSubject = new BehaviorSubject<Seccion[] | null>(null);
  private instanciaIdSubject = new BehaviorSubject<number | null>(null);
  private encuestaIdSubject = new BehaviorSubject<number | null>(null);



  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();
  usuarios: Usuario[] = [];
  secciones$ = this.seccionSubject.asObservable();
  instanciaId$ = this.instanciaIdSubject.asObservable();
  encuestaId$ = this.encuestaIdSubject.asObservable();

  subscription: Subscription | undefined;

  constructor(
    private localStorageService: LocalstorageService,
    private dbService: DbService<Usuario>
  ) {
    this.getUsuarios()

    // Intentar recuperar el estado de la sesión al inicializar el servicio
    const savedLoggedIn = this.localStorageService.getItem('isLoggedIn');
    const savedUserId = this.localStorageService.getItem('userId');

    if (savedLoggedIn && savedUserId) {
      this.isLoggedInSubject.next(JSON.parse(savedLoggedIn));
      this.userIdSubject.next(JSON.parse(savedUserId));
    }
  }
  ngOnInit(): void {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getUsuarios();
    })
  }





  login(email: string, password: string) {
    // Lógica de inicio de sesión

    const user = this.usuarios.find(user => user.clave === password && user.correo === email);

    if (user) {
      if (user.estado === 'activo') {



        this.isLoggedInSubject.next(true);
        this.userIdSubject.next(user.id);

        // Guardar en localStorage
        this.localStorageService.setItem('isLoggedIn', 'true');
        this.localStorageService.setItem('userId', JSON.stringify(user.id));

        return LoginResult.Success;

      } else {
        return LoginResult.InactiveAccount;
      }

    } else {
      return LoginResult.IncorrectCredentials;
    }
  }

  logout() {
    // Verificar si isLoggedIn y userId están presentes en el localStorage
    const isLoggedInExists = this.localStorageService.getItem('isLoggedIn');
    const userIdExists = this.localStorageService.getItem('userId');

    if (isLoggedInExists && userIdExists) {
      // Limpiar solo si las variables de sesión existen
      this.isLoggedInSubject.next(false);
      this.userIdSubject.next(null);
      this.seccionSubject.next(null);
      this.instanciaIdSubject.next(null);

      this.localStorageService.removeItem('isLoggedIn');
      this.localStorageService.removeItem('userId');

      return true;
    }

    return false;
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

  setSeccione(datos: Seccion[]) {

    return this.seccionSubject.next(datos);
  }
  setInstancia(id:any){
    return this.instanciaIdSubject.next(id);
  }
  setEncuesta(id:any){
    return this.encuestaIdSubject.next(id);
  }
}
