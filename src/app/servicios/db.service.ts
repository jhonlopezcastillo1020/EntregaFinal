import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DbService<T> {

  private apiUrl = 'http://localhost:3000';
  private _dataRefresh$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  get dataRefresh$() {
    return this._dataRefresh$;
  }

  /**
   * Obtener todos los elementos de una entidad.
   * @param entidad Nombre de la entidad.
   * @returns Observable que emite un array de elementos de la entidad.
   */
  getAll(entidad: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${entidad}`);
  }

  /**
   * Obtener un elemento de una entidad por su ID.
   * @param entidad Nombre de la entidad.
   * @param id ID del elemento a obtener.
   * @returns Observable que emite el elemento de la entidad con el ID proporcionado.
   */
  getById(entidad: string, id: any): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${entidad}/${id}`);
  }

  /**
   * Agregar un nuevo elemento a una entidad.
   * @param entidad Nombre de la entidad.
   * @param item Elemento a agregar.
   * @returns Observable que emite el elemento recién agregado.
   */
  add(entidad: string, item: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${entidad}`, item).pipe(
      tap(() => {
        this._dataRefresh$.next();
      })
    );

  }

  /**
   * Actualizar un elemento existente en una entidad.
   * @param entidad Nombre de la entidad.
   * @param id ID del elemento a actualizar.
   * @param item Elemento con las actualizaciones.
   * @returns Observable que emite el elemento actualizado.
   */
  update(entidad: string, id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${entidad}/${id}`, item).pipe(
      tap(() => {
        this._dataRefresh$.next();
      })
    );
  }

  /**
   * Eliminar un elemento de una entidad por su ID.
   * @param entidad Nombre de la entidad.
   * @param id ID del elemento a eliminar.
   * @returns Observable que indica el éxito de la operación.
   */
  delete(entidad: string, id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${entidad}/${id}`).pipe(
      tap(() => {
        this._dataRefresh$.next();
      })
    );
  }

}




