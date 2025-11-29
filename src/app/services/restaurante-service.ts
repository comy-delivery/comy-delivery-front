import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Restaurante } from '../Shared/models/Restaurante';
import { RestauranteRequest } from '../Shared/models/auth/restaurante-request';
import { EnderecoRequest } from '../Shared/models/auth/endereco-request';

@Injectable({
  providedIn: 'root',
})
export class RestauranteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/restaurante`;
  // Subject para notificar alterações na lista de restaurantes (criação/atualização)
  private restaurantesChanged = new Subject<void>();
  public restaurantesChanged$ = this.restaurantesChanged.asObservable();

  // ========== RESTAURANTE - CRUD ==========

  cadastrarRestaurante(
    restaurante: RestauranteRequest,
    imagemLogo?: File,
    imagemBanner?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'restaurante',
      new Blob([JSON.stringify(restaurante)], { type: 'application/json' })
    );
    if (imagemLogo) {
      formData.append('imagemLogo', imagemLogo);
    }
    if (imagemBanner) {
      formData.append('imagemBanner', imagemBanner);
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  // Notifica listeners que a alteração ocorreu
  notifyRestaurantesChanged(): void {
    try {
      this.restaurantesChanged.next();
    } catch (e) {
      console.warn('notifyRestaurantesChanged error', e);
    }
  }

  buscarRestaurantePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  buscarRestaurantePorCnpj(cnpj: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cnpj/${cnpj}`);
  }

  atualizarRestaurante(
    id: number,
    restaurante: any,
    imagemLogo?: File,
    imagemBanner?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'restaurante',
      new Blob([JSON.stringify(restaurante)], { type: 'application/json' })
    );

    formData.append(
      'restaurante',
      new Blob([JSON.stringify(restaurante)], { type: 'application/json' })
    );
    if (imagemLogo) {
      formData.append('imagemLogo', imagemLogo);
    }
    if (imagemBanner) {
      formData.append('imagemBanner', imagemBanner);
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  deletarRestaurante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ========== LISTAGENS ==========

  listarRestaurantesAbertos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/abertos`);
  }

  // ========== ENDEREÇOS ==========

  listarEnderecosRestaurante(idRestaurante: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idRestaurante}/enderecos`);
  }

  adicionarEnderecoRestaurante(id: number, endereco: EnderecoRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/enderecos`, endereco);
  }

  alterarEnderecoRestaurante(
    idRestaurante: number,
    idEndereco: number,
    endereco: any
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idRestaurante}/enderecos/${idEndereco}`, endereco);
  }

  // ========== PRODUTOS ==========

  listarProdutosRestaurante(restauranteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${restauranteId}/produtos`);
  }

  //adicionarProduto(restauranteId: number, produto: any): Observable<any> {
  // return this.http.post<any>(`${this.apiUrl}/${restauranteId}/produtos`, produto);
  // }

  atualizarProduto(restauranteId: number, produtoId: number, produto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${restauranteId}/produtos/${produtoId}`, produto);
  }

  removerProduto(restauranteId: number, produtoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${restauranteId}/produtos/${produtoId}`);
  }

  // ========== STATUS DO RESTAURANTE ==========

  abrirRestaurante(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status/abrir`, {});
  }

  fecharRestaurante(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status/fechar`, {});
  }

  disponibilizarRestaurante(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status/disponibilizar`, {});
  }

  indisponibilizarRestaurante(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status/indisponibilizar`, {});
  }

  abrirTodosRestaurantes(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/status/abrir-todos`, {});
  }

  // ========== RECUPERAÇÃO DE SENHA ==========

  iniciarRecuperacaoSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperacao/iniciar`, { email });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperacao/redefinir`, { token, novaSenha });
  }

  // ========== IMAGENS ==========

  atualizarLogo(id: number, imagem: File): Observable<void> {
    const formData = new FormData();
    formData.append('imagem', imagem);
    return this.http.put<void>(`${this.apiUrl}/${id}/logo`, formData);
  }

  buscarLogo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/logo`, { responseType: 'blob' });
  }

  atualizarBanner(id: number, imagem: File): Observable<void> {
    const formData = new FormData();
    formData.append('imagem', imagem);
    return this.http.put<void>(`${this.apiUrl}/${id}/banner`, formData);
  }

  buscarBanner(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/banner`, { responseType: 'blob' });
  }

  // ========== TEMPO MÉDIO DE ENTREGA ==========

  recalcularTempoMedio(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/calcular-tempo-medio`, {});
  }

  // ========== ATUALIZAÇÕES PARCIAIS - SIMPLIFICADO (USA atualizarRestaurante) ==========

  updateConfiguracao(id: number, restauranteCompleto: any): Observable<any> {
    return this.atualizarRestaurante(id, restauranteCompleto);
  }

  updateEndereco(idRestaurante: number, idEndereco: number, endereco: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idRestaurante}/enderecos/${idEndereco}`, endereco);
  }

  updateCategoria(id: number, restauranteCompleto: any): Observable<any> {
    return this.atualizarRestaurante(id, restauranteCompleto);
  }

  updateFuncionamento(id: number, restauranteCompleto: any): Observable<any> {
    return this.atualizarRestaurante(id, restauranteCompleto);
  }

  updateTempoEntrega(id: number, restauranteCompleto: any): Observable<any> {
    return this.atualizarRestaurante(id, restauranteCompleto);
  }

  updateDadosFiscais(id: number, restauranteCompleto: any): Observable<any> {
    return this.atualizarRestaurante(id, restauranteCompleto);
  }

  uploadLogo(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagem', file);
    return this.http.put<any>(`${this.apiUrl}/${id}/logo`, formData);
  }

  uploadBanner(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagem', file);
    return this.http.put<any>(`${this.apiUrl}/${id}/banner`, formData);
  }

  // ========== PRODUTOS - CRUD ==========

/**
 * Criar novo produto para o restaurante
 * Backend espera multipart/form-data com 'produto' (JSON) e 'imagem' (File)
 */
criarProduto(produto: any, imagem: File): Observable<any> {
  const formData = new FormData();
  
  // Adiciona o produto como JSON
  formData.append('produto', new Blob([JSON.stringify(produto)], { type: 'application/json' }));
  
  // Adiciona a imagem (obrigatória)
  formData.append('imagem', imagem);
  
  // POST para /api/produto (não /api/restaurante/{id}/produtos)
  return this.http.post<any>(`${environment.apiUrl}/produto`, formData);
}

/**
 * Atualizar produto existente
 * IMPORTANTE: Imagem é opcional no update
 */
atualizarProduto(produtoId: number, produto: any, imagem?: File): Observable<any> {
  const formData = new FormData();
  
  // Adiciona o produto como JSON
  formData.append('produto', new Blob([JSON.stringify(produto)], { type: 'application/json' }));
  
  // Adiciona a imagem apenas se fornecida
  if (imagem) {
    formData.append('imagem', imagem);
  }
  
  return this.http.put<any>(`${environment.apiUrl}/produto/${produtoId}`, formData);
}

/**
 * Deletar produto
 */
deletarProduto(produtoId: number): Observable<void> {
  return this.http.delete<void>(`${environment.apiUrl}/produto/${produtoId}`);
}

  // ========== MÉTODOS LEGADOS ==========

  buscarRestaurantes(): Observable<any[]> {
    return this.listarRestaurantesAbertos();
  }

  restauranteLogo(id: number): Observable<Blob> {
    return this.buscarLogo(id);
  }

  restauranteBanner(id: number): Observable<Blob> {
    return this.buscarBanner(id);
  }

  listarProdutos(restauranteId: number): Observable<any[]> {
    return this.listarProdutosRestaurante(restauranteId);
  }
}