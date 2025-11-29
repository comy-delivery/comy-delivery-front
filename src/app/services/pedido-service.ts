import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pedido } from '../Shared/models/Pedido';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/pedido` : 'http://localhost:8084/api/pedido';

  buscarPedidos() {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  buscarPedidoPorId(id: number) {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  buscarPedidosPorCliente(idCliente: number) {
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }

  criarPedido(pedido: Pedido) {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }
}
