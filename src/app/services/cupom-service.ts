import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Cupom } from '../Shared/models/Cupom';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CupomService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cupom`;

  // 1. Validar se o cupom é válido 
  validarCupom(codigo: string, valorPedido: number): Observable<boolean> {
    const url = `${this.apiUrl}/${codigo}/validar?valorPedido=${valorPedido}`;
    console.log('🔍 Validando cupom:', url);
    
    return this.http.post<boolean>(url, {}).pipe(
      catchError(err => {
        console.warn('⚠️ Cupom inválido ou erro na validação:', err);
        return of(false);
      })
    );
  }

  // 2. Buscar dados do cupom pelo código
  buscarCupomPorCodigo(codigo: string): Observable<Cupom> {
    return this.http.get<Cupom>(`${this.apiUrl}/codigo/${codigo}`);
  }

  // 3. Calcular desconto 
  calcularDesconto(idCupom: number, valorPedido: number): Observable<number> {
    const url = `${this.apiUrl}/${idCupom}/aplicar-desconto?valorPedido=${valorPedido}`;
    
    // Backend espera POST para este endpoint
    return this.http.post<number>(url, {}); 
  }
}
