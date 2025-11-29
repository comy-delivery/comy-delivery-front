import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdicionalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/adicional`;

  buscarAdicionaisPorProduto(idProduto: number) {
    return this.http.get(`${this.apiUrl}/produto/${idProduto}`);
  }
}
