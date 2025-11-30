import { Component, inject, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Endereco } from '../../Shared/models/Endereco';
import { EnderecoService } from '../../services/endereco-service';
import { EnderecoRequest } from '../../Shared/models/auth/endereco-request';

@Component({
  selector: 'app-endereco-cliente',
  imports: [FormsModule, CommonModule],
  templateUrl: './endereco-cliente.html',
  styleUrl: './endereco-cliente.scss',
})


export class EnderecoCliente implements OnInit{
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private enderecoService = inject(EnderecoService);


  enderecos: Endereco[] = [];
  loading: boolean = true;

  enderecoEmEdicaoId: number | null = null;

  isAdicionando: boolean = false;
  novoEndereco: EnderecoRequest = this.inicializarEnderecoVazio();

  ngOnInit(): void {
    this.carregarEnderecos();
  }

  carregarEnderecos() {
    const userId = this.authService.getUserId();

    if (userId) {
      this.loading = true;
      this.clienteService.listarEnderecosDoCliente(userId).subscribe({
        next: (dados) => {
          this.enderecos = dados.sort((a, b) => (b.isPadrao ? 1 : 0) - (a.isPadrao ? 1 : 0));
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
      this.isAdicionando = false;
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
          this.carregarEnderecos();
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
      this.enderecoService.deletar(id).subscribe({
        next: () => {
          alert('Endereço removido!');
          this.carregarEnderecos();
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          alert('Não foi possível excluir o endereço.');
        }
      });
    }
  }

  definirPadrao(id: number | undefined) {
    if (!id) return;

    this.enderecoService.definirPadrao(id).subscribe({
      next: () => {
        this.carregarEnderecos();
      },
      error: (err) => {
        console.error('Erro ao definir padrão:', err);
        alert('Erro ao definir endereço padrão.');
      }
    });
  }

  // --- CEP ---

  buscarCep(event: any, objetoDestino: any) {
    const cep = event.target.value?.replace(/\D/g, '');
    
    if (cep && cep.length === 8) {
      this.enderecoService.buscarPorCep(cep).subscribe({
        next: (dados) => {
          // Mapeia o retorno da API para os campos do objeto
          // Adapte as propriedades conforme o retorno real da sua API (ex: logradouro ou rua)
          objetoDestino.logradouro = dados.logradouro || dados.rua;
          objetoDestino.bairro = dados.bairro;
          objetoDestino.cidade = dados.cidade || dados.localidade;
          objetoDestino.estado = dados.estado || dados.uf;
          objetoDestino.complemento = dados.complemento;
        },
        error: (err) => console.error('Erro ao buscar CEP:', err)
      });
    }
  }

  // --- Novo Endereço ---

  iniciarNovoEndereco() {
    this.novoEndereco = this.inicializarEnderecoVazio();
    this.isAdicionando = true;
    this.enderecoEmEdicaoId = null; // Cancela outras edições
  }

  cancelarNovo() {
    this.isAdicionando = false;
  }

  salvarNovoEndereco() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.clienteService.cadastrarNovoEndereco(userId, this.novoEndereco).subscribe({
      next: () => {
        alert('Endereço adicionado com sucesso!');
        this.isAdicionando = false;
        this.carregarEnderecos();
      },
      error: (err) => {
        console.error('Erro ao adicionar endereço:', err);
        alert('Erro ao cadastrar endereço.');
      }
    });
  }

  private inicializarEnderecoVazio(): EnderecoRequest {
    return {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      estado: '',
      tipoEndereco: 'CASA', // Valor default do enum/select
      isPadrao: false
    };
  }


 
}
