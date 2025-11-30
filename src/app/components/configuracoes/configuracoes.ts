import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes implements OnInit{

  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private router = inject(Router);


  protected botaoEditar: boolean = true;
  protected isLoading: boolean = false;

  protected cliente: any = {
    nmCliente: '',
    emailCliente: '',
    cpfCliente: '',
    telefoneCliente: ''
  };

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    const userId = this.authService.getUserId(); // Pega o ID do token
    if (userId) {
      this.isLoading = true;
      // GET /api/cliente/{id}
      this.clienteService.buscarClientePorId(userId).subscribe({
        next: (dados) => {
          this.cliente = dados;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados do cliente:', err);
          this.isLoading = false;
        }
      });
    }
  }


  clickEditar() {
    this.botaoEditar = false;
  }

  clickSalvar() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.isLoading = true;
      // PUT /api/cliente/{id} - Atualiza os dados
      this.clienteService.atualizarDadosCliente(userId, this.cliente).subscribe({
        next: () => {
          alert('Dados atualizados com sucesso!');
          this.botaoEditar = true; // Volta para modo leitura
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          alert('Erro ao atualizar dados. Tente novamente.');
          this.isLoading = false;
        }
      });
    }
  }

  clickExcluir() {
    if (confirm('Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.')) {
      const userId = this.authService.getUserId();
      if (userId) {
        // DELETE /api/cliente/{id}
        this.clienteService.deletarCliente(userId).subscribe({
          next: () => {
            alert('Conta excluída com sucesso.');
            // Realiza o logout e redireciona para login
            this.authService.logout(); //
          },
          error: (err) => {
            console.error('Erro ao excluir conta:', err);
            alert('Não foi possível excluir a conta.');
          }
        });
      }
    }
  }

}
