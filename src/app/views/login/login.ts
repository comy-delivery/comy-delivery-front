import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { LoginRequest } from '../../Shared/models/auth/login-request.';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private readonly API_URL_BASE = environment.apiUrl; 

  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  onLogin(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('✅ Login bem-sucedido!', response);
        this.isLoading = false;
        
        // Redirecionar baseado na role
        this.redirectBasedOnRole();
      },
      error: (error) => {
        console.error('❌ Erro ao fazer login:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Usuário ou senha incorretos.';
        } else if (error.status === 403) {
          this.errorMessage = 'Conta desativada. Entre em contato com o suporte.';
        } else if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }
      }
    });
  }

  /**
   * Redireciona baseado na ROLE do usuário
   */
  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRole();
    
    console.log('🔀 Redirecionando usuário com role:', role);
    
    switch(role) {
      case 'CLIENTE':
        this.router.navigate(['/']);
        break;
        
      case 'RESTAURANTE':
        this.router.navigate(['/restaurante-perfil']);
        break;
        
      case 'ENTREGADOR':
        this.router.navigate(['/entregador']);
        break;
        
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
        
      default:
        console.warn('⚠️ Role desconhecida:', role);
        this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle(): void {
    window.location.href = `${this.API_URL_BASE}/oauth2/authorization/google`;
  }
}