import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  //metodo crear localstorage
  constructor() { }
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  //metodo obtener localstorage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  //metodo eliminar localstorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

