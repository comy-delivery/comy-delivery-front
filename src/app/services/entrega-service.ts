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

  buscarEntregasDisponiveis(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Buscar entregas já realizadas/aceitas pelo entregador (histórico)
  buscarEntregasRealizadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/realizadas`);
  }

  aceitarEntrega(id: number, body: any = {}): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, body);
  }
}
