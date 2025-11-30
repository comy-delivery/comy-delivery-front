import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../Shared/models/Produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8084/api/produto';

  listarPorRestaurante(restauranteId: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.API}/restaurante/${restauranteId}`);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  criar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto);
  }

  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${id}`, produto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  itemImagem(id: number): Observable<Blob> {
    return this.http.get(`${this.API}/${id}/imagem`, { 
      responseType: 'blob' 
    });
  }

  uploadImagem(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagem', file);
    return this.http.post(`${this.API}/${id}/imagem`, formData);
  }
}