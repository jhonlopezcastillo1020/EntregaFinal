import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isCollapsed: boolean = false;
  constructor() { }


  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
