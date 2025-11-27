import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Restaurante } from '../Shared/models/Restaurante';

@Injectable({
  providedIn: 'root',
})
export class RestauranteService {
  private http = inject(HttpClient);

  buscarRestaurantes() {
    return this.http.get<Restaurante[]>('http://localhost:8084/api/restaurante/abertos');
  }

  buscarRestaurantePorId(id: number) {
    return this.http.get<Restaurante>(`http://localhost:8084/api/restaurante/${id}`);
  }

  restauranteLogo(id: number) {
    return this.http.get(`http://localhost:8084/api/restaurante/${id}/logo`, {
      responseType: 'blob' as 'blob',
    });
  }

  restauranteBanner(id: number) {
    return this.http.get(`http://localhost:8084/api/restaurante/${id}/banner`, {
      responseType: 'blob' as 'blob',
    });
  }

  // produtos do restaurante
  listarProdutos(restauranteId: number) {
    return this.http.get<any[]>(`http://localhost:8084/api/restaurante/${restauranteId}/produtos`);
  }

  criarProduto(restauranteId: number, produto: any) {
    return this.http.post<any>(
      `http://localhost:8084/api/restaurante/${restauranteId}/produtos`,
      produto
    );
  }

  atualizarProduto(restauranteId: number, produtoId: number, produto: any) {
    return this.http.put<any>(
      `http://localhost:8084/api/restaurante/${restauranteId}/produtos/${produtoId}`,
      produto
    );
  }

  removerProduto(restauranteId: number, produtoId: number) {
    return this.http.delete<any>(
      `http://localhost:8084/api/restaurante/${restauranteId}/produtos/${produtoId}`
    );
  }

  // pedidos do restaurante
  listarPedidos(restauranteId: number) {
    return this.http.get<any[]>(`http://localhost:8084/api/restaurante/${restauranteId}/pedidos`);
  }
}
