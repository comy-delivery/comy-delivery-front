import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../Shared/models/Cliente';
import { ClienteRequest } from '../Shared/models/auth/cliente-request';
import { EnderecoRequest } from '../Shared/models/auth/endereco-request';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cliente`;

  // ========== CLIENTE ==========

  cadastrarCliente(cliente: ClienteRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  buscarClientePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  buscarClientesAtivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ativos`);
  }

  atualizarDadosCliente(id: number, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  deletarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ========== ENDEREÇOS ==========

  listarEnderecosDoCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idCliente}/enderecos`);
  }

  cadastrarNovoEndereco(idCliente: number, endereco: EnderecoRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${idCliente}/enderecos`, endereco);
  }

  atualizarEnderecoCliente(idCliente: number, idEndereco: number, endereco: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idCliente}/enderecos/${idEndereco}`, endereco);
  }

  // ========== PEDIDOS ==========

  listarPedidosDoCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idCliente}/pedidos`);
  }

  // ========== RECUPERAÇÃO DE SENHA ==========

  iniciarRecuperacaoSenha(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, { email }, { responseType: 'text' });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, { token, novaSenha }, { responseType: 'text' });
  }

  // ========== RESTAURANTES PRÓXIMOS ==========

  listarRestaurantesProximos(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idCliente}/restaurantes-distancia`);
  }
}