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
}
