import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cliente } from '../Shared/models/Cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);

  cadastrarCliente(cliente: Cliente) {
    return this.http.post<Cliente>('http://localhost:8084/api/cliente', cliente);
  }
}
