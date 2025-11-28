import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TokenService } from './token-service';
import { LoginResponse } from '../Shared/models/auth/login-response';
import { LoginRequest } from '../Shared/models/auth/login-request.';
import { RefreshTokenResponse } from '../Shared/models/auth/refresh-token-response';
import { RefreshTokenRequest } from '../Shared/models/auth/refresh-token-request';
import { ClienteRequest } from '../Shared/models/auth/cliente-request';
import { EntregadorRequest } from '../Shared/models/auth/entregador-request';
import { RestauranteRequest } from '../Shared/models/auth/restaurante-request';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // BehaviorSubject para controlar estado de autenticação
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenService.hasAccessToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // BehaviorSubject para armazenar dados do usuário atual
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Carregar dados do usuário ao inicializar (se tiver token)
    if (this.tokenService.hasAccessToken()) {
      this.loadUserFromToken();
    }
  }

  // ========== LOGIN ==========

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Salvar tokens
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        
        // Atualizar estado de autenticação
        this.isAuthenticatedSubject.next(true);
        
        // Salvar dados do usuário
        const userData = {
          userId: response.userId,
          username: response.username,
          role: response.role
        };
        this.currentUserSubject.next(userData);
        
        console.log('Login realizado com sucesso!', userData);
      }),
      catchError(error => {
        console.error('Erro ao fazer login:', error);
        return throwError(() => error);
      })
    );
  }

  // ========== LOGOUT ==========

  logout(): void {
    this.tokenService.clearTokens();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    console.log('Logout realizado!');
  }

  // ========== REFRESH TOKEN ==========

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado'));
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/refresh`, request).pipe(
      tap(response => {
        // Atualizar apenas o Access Token (Refresh Token continua o mesmo)
        this.tokenService.setAccessToken(response.accessToken);
        console.log('Token renovado com sucesso!');
      }),
      catchError(error => {
        console.error('Erro ao renovar token:', error);
        this.logout(); // Se refresh falhar, faz logout
        return throwError(() => error);
      })
    );
  }

  // ========== CADASTRO CLIENTE ==========

  registerCliente(data: ClienteRequest): Observable<any> {
    const params = new HttpParams().set('role', 'CLIENTE');
    
    return this.http.post(`${this.apiUrl}/register-complete`, data, { params }).pipe(
      tap(response => {
        console.log('Cliente cadastrado com sucesso!', response);
      }),
      catchError(error => {
        console.error('Erro ao cadastrar cliente:', error);
        return throwError(() => error);
      })
    );
  }

  // ========== CADASTRO ENTREGADOR ==========

  registerEntregador(data: EntregadorRequest): Observable<any> {
    const params = new HttpParams().set('role', 'ENTREGADOR');
    
    return this.http.post(`${this.apiUrl}/register-complete`, data, { params }).pipe(
      tap(response => {
        console.log('Entregador cadastrado com sucesso!', response);
      }),
      catchError(error => {
        console.error('Erro ao cadastrar entregador:', error);
        return throwError(() => error);
      })
    );
  }

  // ========== CADASTRO RESTAURANTE (apenas ADMIN) ==========

  registerRestaurante(data: RestauranteRequest): Observable<any> {
    const params = new HttpParams().set('role', 'RESTAURANTE');
    
    return this.http.post(`${this.apiUrl}/register-complete`, data, { params }).pipe(
      tap(response => {
        console.log('Restaurante cadastrado com sucesso!', response);
      }),
      catchError(error => {
        console.error('Erro ao cadastrar restaurante:', error);
        return throwError(() => error);
      })
    );
  }

  // ========== MÉTODOS AUXILIARES ==========

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.tokenService.getRoleFromToken();
  }

  getUserId(): number | null {
    return this.tokenService.getUserIdFromToken();
  }

  getUsername(): string | null {
    return this.tokenService.getUsernameFromToken();
  }

  private loadUserFromToken(): void {
    const userData = {
      userId: this.tokenService.getUserIdFromToken(),
      username: this.tokenService.getUsernameFromToken(),
      role: this.tokenService.getRoleFromToken()
    };
    
    this.currentUserSubject.next(userData);
  }

  // Verificar se o usuário tem uma role específica
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Verificar se o usuário tem alguma das roles
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }
}