import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token-service';
import { AuthService } from '../services/auth-service';

//faz todas as requisicoes http 
//Adiciona automaticamente o token Authorization: Bearer TOKEN em requisições privadas
//Renova o token automaticamente quando expira (erro 401)
//Faz logout se não conseguir renovar

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // urls publicas
  const publicUrls = [
    '/auth/login',
    '/auth/register-complete',
    '/auth/refresh',
    '/cliente/recuperar-senha',
    '/cliente/redefinir-senha',
    '/restaurante/recuperacao/iniciar',
    '/restaurante/recuperacao/redefinir',
    '/restaurante/abertos',
    '/restaurante/',
    '/restaurante/cnpj/',
    '/cupom',
    '/cupom/codigo/'
  ];

  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Se for URL pública, não adiciona token
  if (isPublicUrl) {
    return next(req);
  }

  // Adicionar token nas requisições privadas
  const token = tokenService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Tratar erros 401 (Unauthorized)
  return next(req).pipe(
    catchError(error => {
      // Se erro 401 e não for a rota de refresh
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        console.log('Token expirado, tentando renovar...');
        
        // Tentar renovar o token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Repetir a requisição original com o novo token
            const newToken = tokenService.getAccessToken();
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(clonedRequest);
          }),
          catchError(refreshError => {
            console.error('Erro ao renovar token, fazendo logout...');
            // Se refresh falhar, faz logout
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Para outros erros, apenas retorna
      return throwError(() => error);
    })
  );
};