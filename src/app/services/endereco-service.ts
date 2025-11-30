import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Endereco } from '../Shared/models/Endereco';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/endereco`;

  buscarPorCep(cep: string) {
    return this.http.get<any>(`${this.apiUrl}/${cep}`);
  }

  deletar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  definirPadrao(id: number) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/padrao`, {});
  }
}
