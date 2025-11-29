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
    } else {
      // Tenta recuperar do localStorage se existir
      const savedUser = localStorage.getItem('comy_user');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
        this.isAuthenticatedSubject.next(true);
      }

    }

  }

  // ========== LOGIN COM USUÁRIO/SENHA ==========

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Salvar tokens
        console.log('Resposta do Login:', response);
        this.tokenService.setTokens(response.jwt, response.refreshToken);
        
        // Atualizar estado de autenticação e dados do usuário
        this.updateAuthState(response.accessToken);
        // Atualizar estado de autenticação
        this.isAuthenticatedSubject.next(true);

        const userId = response.userId || this.tokenService.getUserIdFromToken();
        const username = this.tokenService.getUsernameFromToken();
        const role = this.tokenService.getRoleFromToken();

        const userData = {
          userId: userId,
          username: username,
          role: role
        };

        console.log('Dados do usuário montados:', userData);

        localStorage.setItem('comy_user', JSON.stringify(userData));
        
        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);
        
        console.log('Login realizado com sucesso!', userData);
      }),
      catchError(error => {
        console.error('Erro ao fazer login:', error);
        return throwError(() => error);
      })
    );
  }
  
  // ========== LOGIN COM OAUTH2 (GOOGLE) 🆕 ==========

  /**
   * Processa e armazena os tokens recebidos via redirecionamento OAuth2.
   * Este método é chamado pelo OAuth2CallbackComponent.
   * @param accessToken O Access Token (JWT).
   * @param refreshToken O Refresh Token.
   */
  handleOAuth2Tokens(accessToken: string, refreshToken: string): void {
    // 1. Salvar tokens
    this.tokenService.setTokens(accessToken, refreshToken);
    
    // 2. Atualizar estado de autenticação e dados do usuário
    this.updateAuthState(accessToken);
    
    console.log('Login OAuth2 realizado e tokens salvos.');
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
        this.updateAuthState(response.accessToken); // Atualiza dados do usuário a partir do novo token
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

  // Função interna para atualizar o estado de autenticação
  private updateAuthState(accessToken: string): void {
    // 1. Atualiza estado de autenticação
    this.isAuthenticatedSubject.next(true);

    // 2. Salva dados do usuário decodificando o token
  private loadUserFromToken(): void {

    if (!this.tokenService.hasAccessToken()) {
      return;
    }


    const userData = {
        userId: this.tokenService.getUserIdFromToken(),
        username: this.tokenService.getUsernameFromToken(),
        role: this.tokenService.getRoleFromToken()
    };

    // Certifique-se de que os dados foram obtidos antes de emitir
    if (userData.userId && userData.role) {
      this.currentUserSubject.next(userData);
    } else {
      // Se não conseguiu decodificar (token inválido/expirado), limpa o estado
      this.tokenService.clearTokens();
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  // Função renomeada para ser mais genérica
  private loadUserFromToken(): void {
    // Apenas chama a função de atualização, que faz o trabalho de decodificar e emitir
    const currentToken = this.tokenService.getAccessToken();
    if (currentToken) {
        this.updateAuthState(currentToken);
        localStorage.setItem('comy_user', JSON.stringify(userData));
    }
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