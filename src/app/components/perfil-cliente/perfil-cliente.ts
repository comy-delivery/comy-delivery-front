import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosCliente } from '../pedidos-cliente/pedidos-cliente';
import { EnderecoCliente } from "../endereco-cliente/endereco-cliente";
import { Configuracoes } from "../configuracoes/configuracoes";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { ClienteService } from '../../services/cliente-service';
import { Cliente } from '../../Shared/models/Cliente';


@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, PedidosCliente, EnderecoCliente, Configuracoes],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.scss',
})
export class PerfilCliente {
  private authService = inject(AuthService);
  private clienteService = inject(ClienteService);

  protected opcao: String = 'pedido';
  protected cliente: Cliente | null = null;

  ngOnInit(): void {
    this.carregarDadosCliente();
  }

  carregarDadosCliente() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.clienteService.buscarClientePorId(userId).subscribe({
        next: (dados) => {
          this.cliente = dados;
        },
        error: (err) => console.error('Erro ao carregar dados do perfil:', err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }

}
