import { Component, inject, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Endereco } from '../../Shared/models/Endereco';

@Component({
  selector: 'app-endereco-cliente',
  imports: [FormsModule, CommonModule],
  templateUrl: './endereco-cliente.html',
  styleUrl: './endereco-cliente.scss',
})


export class EnderecoCliente implements OnInit{
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);


  enderecos: Endereco[] = [];
  loading: boolean = true;

  enderecoEmEdicaoId: number | null = null;

  ngOnInit(): void {
    this.carregarEnderecos();
  }

  carregarEnderecos() {
    const userId = this.authService.getUserId();

    if (userId) {
      this.loading = true;
      this.clienteService.listarEnderecosDoCliente(userId).subscribe({
        next: (dados) => {
          this.enderecos = dados;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar endereços:', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  clickEditar(idEndereco: number | undefined) {
    if (idEndereco) {
      this.enderecoEmEdicaoId = idEndereco;
    }
  }

  clickCancelar() {
    this.enderecoEmEdicaoId = null;
    this.carregarEnderecos(); // Recarrega para desfazer alterações não salvas
  }

  clickSalvar(endereco: Endereco) {
    const userId = this.authService.getUserId();
    
    if (userId && endereco.idEndereco) {
      // Chama o endpoint de atualização
      this.clienteService.atualizarEnderecoCliente(userId, endereco.idEndereco, endereco).subscribe({
        next: () => {
          alert('Endereço atualizado com sucesso!');
          this.enderecoEmEdicaoId = null;
        },
        error: (err) => {
          console.error('Erro ao atualizar endereço:', err);
          alert('Erro ao atualizar. Tente novamente.');
        }
      });
    }
  }

  excluirEndereco(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja remover este endereço?')) {
      // Implementar chamada de exclusão no service se necessário
      console.log('Solicitada exclusão do endereço:', id);
      // this.clienteService.deletarEndereco(id)...
    }
  }


 
}
