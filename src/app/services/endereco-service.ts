import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Endereco } from '../Shared/models/Endereco';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  private http = inject(HttpClient);

  buscarPorCep(cep: string) {
    return this.http.get<Endereco>(`http://localhost:8084/api/endereco/cep/${cep}`);
  }
}
