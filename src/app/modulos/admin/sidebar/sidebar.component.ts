import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { userInfo } from 'src/app/modelos/userInfo.mode';
import { Usuario } from 'src/app/modelos/usuario,model';
import { AuthService } from 'src/app/servicios/auth.service';
import { DbService } from 'src/app/servicios/db.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit{

  perfil: any;
  subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private dbService:DbService<Usuario>
  ) {

   this.getPerfil();

  }

  getPerfil(){
    this.authService.userId$.subscribe(data => {
      
      
     if(data){
      this.dbService.getById('usuario',data).subscribe(usuario=>{
        if(usuario){
            this.perfil=usuario;

  
        }
        
      })
     }

      

    });
  }
  ngOnInit(): void {
    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getPerfil();
    })


  }



}
