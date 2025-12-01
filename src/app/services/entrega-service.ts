import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { StatusEntrega } from '../Shared/models/StatusEntrega';

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
    return this.http.get<any[]>(`${this.apiUrl}/status?status=PENDENTE`);
  }

  // Buscar entregas já realizadas/aceitas pelo entregador (histórico)
  buscarEntregasRealizadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/realizadas`);
  }

  obterDashboardEntregador(idEntregador: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/entregador/${idEntregador}/dashboard`);
  }

  // ========== 🆕 NOVOS MÉTODOS ADICIONADOS ==========

  /**
   * Busca entregas atribuídas a um entregador específico
   */
  buscarEntregasDoEntregador(entregadorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entregador/${entregadorId}`);
  }

  /**
   * Iniciar rota (PENDENTE -> EM_ROTA)
   */
  iniciarRota(entregaId: number, entregadorId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${entregaId}`, {
      StatusEntrega: 'EM_ROTA',
      entregadorId: entregadorId
    });
  }

  /**
   * Concluir entrega (EM_ROTA -> CONCLUIDA)
   * Backend espera: PATCH /api/entrega/{id} com body { status: "CONCLUIDA" }
   */
  concluirEntrega(entregaId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${entregaId}`, {
      StatusEntrega: 'CONCLUIDA'
    });
  }
  /**
   * Cancelar entrega
   */
  cancelarEntrega(entregaId: number, entregadorId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${entregaId}`, {
      statusEntrega: 'CANCELADA',
      entregadorId: entregadorId
    });
  }
}