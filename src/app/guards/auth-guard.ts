import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

/**
Guard para proteger rotas que exigem autenticação*/

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Verificar roles se necessário
    const requiredRoles = route.data['roles'] as string[];
    
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = authService.getUserRole();
      
      if (userRole && requiredRoles.includes(userRole)) {
        return true;
      } else {
        // Usuário não tem permissão
        console.warn('Acesso negado: usuário não possui a role necessária');
        router.navigate(['/unauthorized']);
        return false;
      }
    }
    
    return true;
  }

  // Não está logado, redireciona para login
  console.log('Usuário não autenticado, redirecionando para login...');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guard para rotas públicas (login, cadastro)
 */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  //se logado, redireciona para home
  console.log('Usuário já está logado, redirecionando para home...');
  router.navigate(['/']);
  return false;
};

/**Guard para verificar role específica */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole();

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  console.warn('Acesso negado: role insuficiente');
  router.navigate(['/unauthorized']);
  return false;
};