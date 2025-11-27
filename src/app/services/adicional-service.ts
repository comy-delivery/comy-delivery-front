import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdicionalService {
  private http = inject(HttpClient);

  buscarAdicionaisPorProduto(idProduto: number) {
    return this.http.get(`http://localhost:8084/api/adicional/produto/${idProduto}`);
  }
}
