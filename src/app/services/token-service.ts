import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;

  constructor() {}

  // ========== ACCESS TOKEN ==========

  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  // ========== REFRESH TOKEN ==========

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // ========== AMBOS ==========

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  }

  // ========== DECODE TOKEN (útil para pegar info do usuário) ==========

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  getUserIdFromToken(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const decoded = this.decodeToken(token);
    return decoded?.userId || null;
  }

  getUsernameFromToken(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  }

  getRoleFromToken(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const decoded = this.decodeToken(token);
    return decoded?.roles || null;
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const expirationDate = decoded.exp * 1000; // Converter para milissegundos
    return Date.now() > expirationDate;
  }
}