import { Component } from '@angular/core';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent {
  isCollapsed: boolean = false;
  

  constructor(public sidebarService: SidebarService) { }







}