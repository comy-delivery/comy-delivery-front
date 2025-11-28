import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';
import { ClienteRequest } from '../../Shared/models/auth/cliente-request';
import { EntregadorRequest } from '../../Shared/models/auth/entregador-request';
import { EnderecoRequest } from '../../Shared/models/auth/endereco-request';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Tipo de cadastro
  protected opcao: 'cliente' | 'entregador' = 'cliente';
  protected tipoVeiculo: string = '';
  protected confirmacaoSenha: string = '';
  protected carregandoCep: boolean = false;
  
  // Username temporário compartilhado
  protected username: string = '';
  
  // Estados do formulário
  isLoading = false;
  errorMessage = '';

  // Dados do Cliente
  clienteData: ClienteRequest = {
    username: '',
    password: '',
    nmCliente: '',
    emailCliente: '',
    cpfCliente: '',
    telefoneCliente: '',
    enderecos: []
  };

  // Dados do Entregador
  entregadorData: EntregadorRequest = {
    username: '',
    password: '',
    nmEntregador: '',
    emailEntregador: '',
    cpfEntregador: '',
    telefoneEntregador: '',
    veiculo: '',
    placa: ''
  };

  // Endereço temporário (para cliente)
  enderecoTemp: EnderecoRequest = {
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: '',
    tipoEndereco: 'RESIDENCIAL',
    pontoDeReferencia: '',
    isPadrao: true,
    latitude: 0,
    longitude: 0
  };

  //buscar cep (via cep)
  buscarCep() {
    const cepLimpo = this.enderecoTemp.cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return;
    }

    this.carregandoCep = true;
    this.errorMessage = '';

    // Usar API pública do ViaCEP
    this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.errorMessage = 'CEP não encontrado.';
          this.carregandoCep = false;
          return;
        }

        // Preencher campos automaticamente
        this.enderecoTemp.logradouro = dados.logradouro || '';
        this.enderecoTemp.bairro = dados.bairro || '';
        this.enderecoTemp.cidade = dados.localidade || '';
        this.enderecoTemp.estado = dados.uf || '';
        this.enderecoTemp.complemento = dados.complemento || '';

        this.carregandoCep = false;
      },
      error: (err) => {
        console.error('Erro ao buscar CEP:', err);
        this.errorMessage = 'Erro ao buscar CEP. Tente novamente.';
        this.carregandoCep = false;
      }
    });
  }

  // ========== CADASTRAR ==========
  cadastrar() {
    // Limpar mensagem de erro
    this.errorMessage = '';

    // Validação de username
    if (!this.username || this.username.trim() === '') {
      this.errorMessage = 'Por favor, escolha um nome de usuário.';
      return;
    }

    // Validação de senha
    const senhaAtual = this.opcao === 'cliente' 
      ? this.clienteData.password 
      : this.entregadorData.password;

    if (senhaAtual !== this.confirmacaoSenha) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    // Validação de senha mínima
    if (senhaAtual.length < 8) {
      this.errorMessage = 'A senha deve ter no mínimo 8 caracteres.';
      return;
    }

    this.isLoading = true;

    if (this.opcao === 'cliente') {
      // Atribuir username antes de enviar
      this.clienteData.username = this.username;
      this.cadastrarCliente();
    } else {
      // Atribuir username antes de enviar
      this.entregadorData.username = this.username;
      this.cadastrarEntregador();
    }
  }

// cadastrar cliente
private cadastrarCliente() {
  // Validação de campos obrigatórios
  if (!this.clienteData.nmCliente || !this.clienteData.emailCliente || 
      !this.clienteData.cpfCliente || !this.clienteData.telefoneCliente) {
    this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    this.isLoading = false;
    return;
  }

  // Validação de endereço
  if (!this.enderecoTemp.logradouro || !this.enderecoTemp.numero || 
      !this.enderecoTemp.cidade || !this.enderecoTemp.cep) {
    this.errorMessage = 'Por favor, preencha todos os campos do endereço.';
    this.isLoading = false;
    return;
  }

  // Adicionar endereço ao array
  this.clienteData.enderecos = [this.enderecoTemp];

  console.log('📤 Enviando cadastro de cliente:', this.clienteData);

  this.authService.registerCliente(this.clienteData).subscribe({
    next: (response) => {
      console.log('✅ Cliente cadastrado com sucesso!', response);
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      this.router.navigate(['/login']);
    },
    error: (error) => {
      console.error('❌ Erro ao cadastrar cliente:', error);
      console.error('❌ error.error:', error.error);
      
      this.isLoading = false;

      // Tratar erros específicos
      if (error.status === 409) {
        // Pegar a mensagem de erro (pode vir como string ou objeto)
        let errorMsg = '';
        
        if (typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else {
          errorMsg = JSON.stringify(error.error);
        }
        
        console.log('📝 Mensagem de erro:', errorMsg);
        
        // Verificar qual campo está duplicado
        const msgLower = errorMsg.toLowerCase();
        
        if (msgLower.includes('username') || msgLower.includes('usuário') || msgLower.includes('usuario')) {
          this.errorMessage = 'Nome de usuário já está em uso. Escolha outro.';
        } else if (msgLower.includes('email') || msgLower.includes('e-mail')) {
          this.errorMessage = 'E-mail já cadastrado.';
        } else if (msgLower.includes('cpf')) {
          this.errorMessage = 'CPF já cadastrado.';
        } else {
          // Se não conseguir identificar, mostra a mensagem genérica
          this.errorMessage = 'Dados já cadastrados. Verifique username, e-mail ou CPF.';
        }
      } else if (error.status === 400) {
        this.errorMessage = 'Dados inválidos. Verifique os campos.';
      } else if (error.status === 0) {
        this.errorMessage = 'Não foi possível conectar ao servidor.';
      } else {
        this.errorMessage = 'Erro ao realizar cadastro.';
      }
    }
  });
}

// cadastrar entregador
private cadastrarEntregador() {
  // Validação de campos obrigatórios
  if (!this.entregadorData.nmEntregador || !this.entregadorData.emailEntregador || 
      !this.entregadorData.cpfEntregador || !this.tipoVeiculo) {
    this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    this.isLoading = false;
    return;
  }

  // Validação de placa (se for moto ou carro)
  if ((this.tipoVeiculo === 'moto' || this.tipoVeiculo === 'carro') && !this.entregadorData.placa) {
    this.errorMessage = 'Por favor, informe a placa do veículo.';
    this.isLoading = false;
    return;
  }
  
  // Mapear tipo de veículo
  this.entregadorData.veiculo = this.tipoVeiculo.toUpperCase();

  console.log('📤 Enviando cadastro de entregador:', this.entregadorData);

  this.authService.registerEntregador(this.entregadorData).subscribe({
    next: (response) => {
      console.log('✅ Entregador cadastrado com sucesso!', response);
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      this.router.navigate(['/login']);
    },
    error: (error) => {
      console.error('❌ Erro ao cadastrar entregador:', error);
      console.error('❌ error.error:', error.error);
      
      this.isLoading = false;

      // Tratar erros específicos
      if (error.status === 409) {
        // Pegar a mensagem de erro (pode vir como string ou objeto)
        let errorMsg = '';
        
        if (typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else {
          errorMsg = JSON.stringify(error.error);
        }
        
        console.log('📝 Mensagem de erro:', errorMsg);
        
        // Verificar qual campo está duplicado
        const msgLower = errorMsg.toLowerCase();
        
        if (msgLower.includes('username') || msgLower.includes('usuário') || msgLower.includes('usuario')) {
          this.errorMessage = 'Nome de usuário já está em uso. Escolha outro.';
        } else if (msgLower.includes('email') || msgLower.includes('e-mail')) {
          this.errorMessage = 'E-mail já cadastrado.';
        } else if (msgLower.includes('cpf')) {
          this.errorMessage = 'CPF já cadastrado.';
        } else {
          // Se não conseguir identificar, mostra a mensagem genérica
          this.errorMessage = 'Dados já cadastrados. Verifique username, e-mail ou CPF.';
        }
      } else if (error.status === 400) {
        this.errorMessage = 'Dados inválidos. Verifique os campos.';
      } else if (error.status === 0) {
        this.errorMessage = 'Não foi possível conectar ao servidor.';
      } else {
        this.errorMessage = 'Erro ao realizar cadastro.';
      }
    }
  });
}
  // limpar form ao trocar tipo
  limparFormulario() {
    this.username = '';
    
    this.clienteData = {
      username: '',
      password: '',
      nmCliente: '',
      emailCliente: '',
      cpfCliente: '',
      telefoneCliente: '',
      enderecos: []
    };

    this.entregadorData = {
      username: '',
      password: '',
      nmEntregador: '',
      emailEntregador: '',
      cpfEntregador: '',
      telefoneEntregador: '',
      veiculo: '',
      placa: ''
    };

    this.enderecoTemp = {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      estado: '',
      tipoEndereco: 'RESIDENCIAL',
      pontoDeReferencia: '',
      isPadrao: true,
      latitude: 0,
      longitude: 0
    };

    this.confirmacaoSenha = '';
    this.tipoVeiculo = '';
    this.errorMessage = '';
  }
}