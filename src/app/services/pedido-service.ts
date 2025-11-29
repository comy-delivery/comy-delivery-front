import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido } from '../Shared/models/Pedido';
import { environment } from '../../environments/environment';

export interface DashboardRestaurante {
  totalPedidosHistorico: number;
  faturamentoDiario: number;
}

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

  // ========== PEDIDOS POR CLIENTE ==========

  listarPorCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // ========== PEDIDOS POR RESTAURANTE ==========

  listarPorRestaurante(restauranteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/restaurante/${restauranteId}`);
  }

  listarPedidosPendentes(restauranteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/restaurante/${restauranteId}/pendentes`);
  }

  listarPedidosAceitos(restauranteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/restaurante/${restauranteId}/aceitos`);
  }

  listarPedidosRecusados(restauranteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/restaurante/${restauranteId}/recusados`);
  }

  // ========== DASHBOARD ==========

  obterDashboard(restauranteId: number): Observable<DashboardRestaurante> {
    return this.http.get<DashboardRestaurante>(`${this.apiUrl}/restaurante/${restauranteId}/dashboard`);
  }

  // ========== AÇÕES DO PEDIDO ==========

  aceitarPedido(id: number, aceitar: boolean, tempoEstimado?: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/aceitar`, {
      aceito: aceitar,
      tempoEstimado: tempoEstimado
    });
  }

  recusarPedido(id: number, motivo: string): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/recusar`, null, {
      params: { motivo }
    });
  }

  atualizarStatus(id: number, status: string): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  cancelarPedido(id: number, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      params: { motivo }
    });
  }

  finalizarPedido(id: number): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${id}/finalizar`, {});
  }

  // ========== CÁLCULOS ==========

  calcularSubtotal(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/subtotal`);
  }

  calcularTotal(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/total`);
  }

  calcularValorEntrega(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/valor-entrega`);
  }

  calcularDesconto(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/desconto`);
  }

  calcularTempoEstimado(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/tempo-estimado`);
  }

  // ========== CUPOM ==========

  aplicarCupom(id: number, cupomId: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/cupom`, null, {
      params: { cupomId: cupomId.toString() }
    });
  }

  removerCupom(id: number): Observable<Pedido> {
    return this.http.delete<Pedido>(`${this.apiUrl}/${id}/cupom`);
  }
}