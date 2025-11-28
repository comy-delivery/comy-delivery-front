import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pedido } from '../Shared/models/Pedido';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);

  buscarPedidos() {
    return this.http.get<Pedido[]>('http://localhost:8084/api/pedido');
  }

  buscarPedidoPorId(id: number) {
    return this.http.get<Pedido>(`http://localhost:8084/api/pedido/${id}`);
  }

  criarPedido(pedido: Pedido) {
    return this.http.post<Pedido>('http://localhost:8084/api/pedido', pedido);
  }
}
