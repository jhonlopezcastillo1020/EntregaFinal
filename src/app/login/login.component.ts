import { Component, OnInit } from '@angular/core';
import { LoginResult } from '../modelos/login-result.enum';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginForm: FormGroup;
  loginResultMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  login() {
    // Verifica si el formulario es válido antes de intentar el inicio de sesión

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email
      const password = this.loginForm.value.password;

      const result: LoginResult = this.authService.login(email, password);


      switch (result) {
        case LoginResult.Success:
          console.log('Inicio de sesión exitoso');
          this.router.navigate(['/manager']);
          break;
        case LoginResult.InactiveAccount:
          this.loginResultMessage = 'La cuenta está inactiva';
          break;
        case LoginResult.IncorrectCredentials:
          this.loginResultMessage = 'Credenciales incorrectas';
          break;
        // Otros casos según sea necesario
      }
    }
  }

}
