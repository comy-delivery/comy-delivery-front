import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntregadorService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/entregador`;

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  atribuirEntrega(idEntregador: number, idEntrega: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${idEntregador}/atribuir/${idEntrega}`, {});
  }

  atualizar(id: number, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }
  
}
