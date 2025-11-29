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
  // Injetar services
  private authService = inject(AuthService);
  private router = inject(Router);

  // Propriedade para a URL base da API
  private readonly API_URL_BASE = environment.apiUrl; 

  // Dados do formulário
  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  // Estados do formulário
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  // Método de login
  onLogin(): void {
    // Validação básica
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        
        // Redirecionar baseado na role
        const role = response.role;
        
        if (role === 'CLIENTE') {
          this.router.navigate(['/']);
        } else if (role === 'RESTAURANTE') {
          this.router.navigate(['/restaurante/dashboard']);
        } else if (role === 'ENTREGADOR') {
          this.router.navigate(['/entregador/entregas']);
        } else if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);
        this.isLoading = false;
        
        // Tratar diferentes tipos de erro
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

  // Alternar visibilidade da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Redireciona o usuário para o endpoint do backend que inicia a autenticação do Google.
   */
 loginWithGoogle(): void {
  window.location.href = 'http://localhost:8084/oauth2/authorization/google';
}
}