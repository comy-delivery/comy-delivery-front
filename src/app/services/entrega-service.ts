import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntregaService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/entrega`;

  buscarPorPedido(idPedido: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pedido/${idPedido}`);
  }
  
}
