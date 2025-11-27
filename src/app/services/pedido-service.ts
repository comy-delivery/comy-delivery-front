import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);

  buscarPedidos() {
    return this.http.get<any[]>('http://localhost:8084/api/pedido');
  }

  buscarPedidoPorId(id: number) {
    return this.http.get<any>(`http://localhost:8084/api/pedido/${id}`);
  }
}
