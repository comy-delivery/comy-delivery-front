import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ClienteService } from '../../services/cliente-service';
import { EnderecoService } from '../../services/endereco-service'; // <--- IMPORTAR
import { Cliente } from '../../Shared/models/Cliente';
import { Endereco } from '../../Shared/models/Endereco';
import { RoleUsuario } from '../../Shared/models/RoleUsuario';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro {
  private clienteService = inject(ClienteService);
  private enderecoService = inject(EnderecoService); // <--- INJETAR
  private router = inject(Router);

  protected opcao: string = 'cliente';
  protected tipoVeiculo: string = '';
  protected confirmacaoSenha: string = '';
  protected carregandoCep: boolean = false; // Para dar feedback visual

  // Inicialização do Cliente
  cliente: Cliente = {
    username: '',
    password: '',
    roleUsuario: RoleUsuario.CLIENTE,
    recuperar: false,
    isAtivo: true,
    nmCliente: '',
    emailCliente: '',
    cpfCliente: '',
    telefoneCliente: '',
    enderecos: [],
    pedidos: [],
  } as Cliente;

  // Inicialização do Endereço
  enderecoTemp: Endereco = {
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: '',
    isPadrao: true,
  } as Endereco;

  // --- NOVA FUNÇÃO PARA BUSCAR O CEP ---
  buscarCep() {
    // 1. Remove caracteres não numéricos (traços, pontos)
    const cepLimpo = this.enderecoTemp.cep.replace(/\D/g, '');

    // 2. Verifica se tem 8 dígitos
    if (cepLimpo.length !== 8) {
      return; // CEP inválido, não faz nada
    }

    this.carregandoCep = true;

    this.enderecoService.buscarPorCep(cepLimpo).subscribe({
      next: (dadosEndereco) => {
        // Preenche os campos automaticamente
        // Verificar se o backend retorna exatamente esses nomes de campos
        if (dadosEndereco) {
          this.enderecoTemp.logradouro = dadosEndereco.logradouro;
          this.enderecoTemp.bairro = dadosEndereco.bairro;
          this.enderecoTemp.cidade = dadosEndereco.cidade;
          this.enderecoTemp.estado = dadosEndereco.estado;

          // Se o backend retornar complemento ou outros campos, mapeie aqui
        }
        this.carregandoCep = false;
      },
      error: (err) => {
        console.error('Erro ao buscar CEP', err);
        this.carregandoCep = false;
        alert('CEP não encontrado');
      },
    });
  }

  cadastrar() {
    // Validação de Senha
    if (this.cliente.password !== this.confirmacaoSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (this.opcao === 'cliente') {
      // REGRA DE NEGÓCIO: O Username será o Email
      this.cliente.username = this.cliente.emailCliente;

      // Adiciona o endereço preenchido ao array do cliente
      this.cliente.enderecos = [this.enderecoTemp];

      console.log('Enviando Payload:', this.cliente);

      this.clienteService.cadastrarCliente(this.cliente).subscribe({
        next: (res) => {
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          alert('Erro ao realizar cadastro. Verifique os dados.');
        },
      });
    } else {
      alert('Cadastro de entregador em breve.');
    }
  }
}
