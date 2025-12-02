import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { RestauranteService } from '../../services/restaurante-service';
import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';
import { PedidosRestauranteComponent } from "../pedidos-restaurante/pedidos-restaurante";

@Component({
  selector: 'app-home-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, PedidosRestauranteComponent],
  templateUrl: './home-restaurante.html',
  styleUrls: ['./home-restaurante.scss']
})
export class HomeRestauranteComponent implements OnInit {
  private authService = inject(AuthService);
  private restauranteService = inject(RestauranteService);
  private router = inject(Router);

  opcao: string = 'config';
  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  restauranteId: number | null = null;

  restaurante: any = {
    nmRestaurante: '',
    emailRestaurante: '',
    cnpj: '',
    telefoneRestaurante: '',
    descricaoRestaurante: '',
    categoria: '',
    horarioAbertura: '',
    horarioFechamento: '',
    diasFuncionamento: [],
    tempoMediaEntrega: 0,
    imagemLogo: '',
    imagemBanner: '',
    enderecos: [
      {
        idEndereco: null,
        rua: '',
        numero: '',
        bairro: '',
        cidade: ''
      }
    ]
  };

  ngOnInit(): void {
    this.restauranteId = this.authService.getUserId();

    if (!this.restauranteId) {
      console.error('❌ ID do restaurante não encontrado');
      this.errorMessage = 'Erro ao carregar dados do restaurante';
      this.isLoading = false;
      return;
    }

    console.log('🔍 Buscando dados do restaurante ID:', this.restauranteId);
    this.carregarDadosRestaurante();
  }

  carregarDadosRestaurante(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.restauranteService.buscarRestaurantePorId(this.restauranteId!).subscribe({
      next: (data) => {
        console.log('✅ Dados do restaurante carregados:', data);
        this.restaurante = data;
        
        if (!this.restaurante.enderecos || this.restaurante.enderecos.length === 0) {
          this.restaurante.enderecos = [{
            idEndereco: null,
            rua: '',
            numero: '',
            bairro: '',
            cidade: ''
          }];
        }

        if (!this.restaurante.diasFuncionamento) {
          this.restaurante.diasFuncionamento = [];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar dados:', error);
        this.errorMessage = 'Erro ao carregar dados do restaurante';
        this.isLoading = false;
      }
    });
  }

  toggleDia(dia: string, event: any): void {
    if (event.target.checked) {
      if (!this.restaurante.diasFuncionamento.includes(dia)) {
        this.restaurante.diasFuncionamento.push(dia);
      }
    } else {
      this.restaurante.diasFuncionamento = 
        this.restaurante.diasFuncionamento.filter((d: string) => d !== dia);
    }
  }

  uploadLogo(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.restauranteService.uploadLogo(this.restauranteId!, file).subscribe({
      next: (response) => {
        console.log('✅ Logo enviado com sucesso:', response);
        this.successMessage = 'Logo atualizado com sucesso!';
        this.isSaving = false;
        
        const reader = new FileReader();
        reader.onload = () => {
          this.restaurante.imagemLogo = reader.result as string;
        };
        reader.readAsDataURL(file);
        
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao enviar logo:', error);
        this.errorMessage = 'Erro ao enviar logo';
        this.isSaving = false;
      }
    });
  }

  uploadBanner(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.restauranteService.uploadBanner(this.restauranteId!, file).subscribe({
      next: (response) => {
        console.log('✅ Banner enviado com sucesso:', response);
        this.successMessage = 'Banner atualizado com sucesso!';
        this.isSaving = false;
        
        const reader = new FileReader();
        reader.onload = () => {
          this.restaurante.imagemBanner = reader.result as string;
        };
        reader.readAsDataURL(file);
        
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao enviar banner:', error);
        this.errorMessage = 'Erro ao enviar banner';
        this.isSaving = false;
      }
    });
  }

  /**
   * Salvar configurações - envia o objeto completo
   */
  salvarConfig(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Envia o restaurante completo
    this.restauranteService.updateConfiguracao(this.restauranteId!, this.restaurante).subscribe({
      next: (response) => {
        console.log('✅ Configurações salvas:', response);
        this.successMessage = 'Configurações salvas com sucesso!';
        this.restaurante = response; // Atualiza com a resposta do servidor
        this.isSaving = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao salvar:', error);
        this.errorMessage = 'Erro ao salvar configurações';
        this.isSaving = false;
      }
    });
  }

  /**
   * Salvar endereço - usa o endpoint específico de endereços
   */
  salvarEndereco(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const endereco = this.restaurante.enderecos[0];
    const idEndereco = endereco.idEndereco;

    if (!idEndereco) {
      this.errorMessage = 'ID do endereço não encontrado';
      this.isSaving = false;
      return;
    }

    this.restauranteService.updateEndereco(this.restauranteId!, idEndereco, endereco).subscribe({
      next: (response) => {
        console.log('✅ Endereço salvo:', response);
        this.successMessage = 'Endereço salvo com sucesso!';
        this.isSaving = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao salvar endereço:', error);
        this.errorMessage = 'Erro ao salvar endereço';
        this.isSaving = false;
      }
    });
  }

  /**
   * Salvar categoria - envia o objeto completo
   */
  salvarCategoria(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.restauranteService.updateCategoria(this.restauranteId!, this.restaurante).subscribe({
      next: (response) => {
        console.log('✅ Categoria salva:', response);
        this.successMessage = 'Categoria salva com sucesso!';
        this.restaurante = response;
        this.isSaving = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao salvar categoria:', error);
        this.errorMessage = 'Erro ao salvar categoria';
        this.isSaving = false;
      }
    });
  }

  /**
   * Salvar funcionamento - envia o objeto completo
   */
  salvarFuncionamento(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.restauranteService.updateFuncionamento(this.restauranteId!, this.restaurante).subscribe({
      next: (response) => {
        console.log('✅ Funcionamento salvo:', response);
        this.successMessage = 'Horário de funcionamento salvo com sucesso!';
        this.restaurante = response;
        this.isSaving = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao salvar funcionamento:', error);
        this.errorMessage = 'Erro ao salvar horário de funcionamento';
        this.isSaving = false;
      }
    });
  }

  /**
   * Salvar tempo de entrega - envia o objeto completo
   */
  salvarEntrega(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.restauranteService.updateTempoEntrega(this.restauranteId!, this.restaurante).subscribe({
      next: (response) => {
        console.log('✅ Tempo de entrega salvo:', response);
        this.successMessage = 'Tempo de entrega salvo com sucesso!';
        this.restaurante = response;
        this.isSaving = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao salvar tempo de entrega:', error);
        this.errorMessage = 'Erro ao salvar tempo de entrega';
        this.isSaving = false;
      }
    });
  }

  /**
   * Salvar dados fiscais - envia o objeto completo
   */
  salvarFiscal(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.restauranteService.updateDadosFiscais(this.restauranteId!, this.restaurante).subscribe({
      next: (response) => {
        console.log('✅ Dados fiscais salvos:', response);
        this.successMessage = 'Dados fiscais salvos com sucesso!';
        this.restaurante = response;
        this.isSaving = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('❌ Erro ao salvar dados fiscais:', error);
        this.errorMessage = 'Erro ao salvar dados fiscais';
        this.isSaving = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}