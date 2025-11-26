import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Produto } from '../Shared/models/Produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);

  buscarProdutos(id: number) {
    return this.http.get<Produto[]>(`http://localhost:8084/api/produto/restaurante/${id}`);
  }

  itemImagem(id: number) {
    return this.http.get(`http://localhost:8084//api/produto/${id}/imagem`, {
      responseType: 'blob' as 'blob',
    });
  }
}
