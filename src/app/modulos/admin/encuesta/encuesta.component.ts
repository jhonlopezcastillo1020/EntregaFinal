import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Encuesta } from 'src/app/modelos/encuesta.modelo';
import { Instancia } from 'src/app/modelos/instancia.modelo';
import { AuthService } from 'src/app/servicios/auth.service';
import { DbService } from 'src/app/servicios/db.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.sass']
})
export class EncuestaComponent implements OnInit {
  isCollapsed: boolean = false;
  pregunta: any;
  instancia: Instancia | undefined;
  subscription: Subscription | undefined;


  encuesta: Encuesta | undefined;
  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService,
    private dbService: DbService<Encuesta>,
    private instdbService: DbService<Instancia>
  ) {
    this.getEncuesta();
    this.getInstancia();

  }
  ngOnInit(): void {

    this.subscription = this.dbService.dataRefresh$.subscribe(() => {
      this.getEncuesta();
      this.getInstancia();
    })
  }

  getEncuesta() {
    this.authService.encuestaId$.subscribe(id => {

      if (id) {
        this.dbService.getById('encuesta', id).subscribe(data => {
          if (data) {
            this.encuesta = data;
          }
        })
      }
    })
  }

  getInstancia() {
    this.authService.instanciaId$.subscribe(id => {

      if (id) {
        this.instdbService.getById('instancia', id).subscribe(data => {
          if (data) {
            this.instancia = data;

          
          }
        })
      }
    })
  }


  onPregunta(item: any) {

    console.log(item.id);

    this.pregunta = item
    const preguntaSeleccionadaElement = document.getElementById(`pregunta_${item.id}`);
    if (preguntaSeleccionadaElement) {
      preguntaSeleccionadaElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

}
