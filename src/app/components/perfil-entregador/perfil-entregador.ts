import { Component, inject, OnInit } from '@angular/core';
import { EntregaDisponivel } from '../entrega-disponivel/entrega-disponivel';
import { PainelEntregador } from '../painel-entregador/painel-entregador';
import { Entregador } from '../../Shared/models/Entregador';
import { EntregadorService } from '../../services/entregador-service';
import { EntregaService } from '../../services/entrega-service';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-entregador',
  imports: [EntregaDisponivel, PainelEntregador, FormsModule, CommonModule],
  templateUrl: './perfil-entregador.html',
  styleUrl: './perfil-entregador.scss',
})
export class PerfilEntregador implements OnInit {

  private entregadorService = inject(EntregadorService);
  private entregaService = inject(EntregaService);
  private authService = inject(AuthService);

  entregador: Entregador | null = null;
  
  // Stats
  totalEntregas: number = 0;
  avaliacaoMedia: number = 5.0;
  ganhosTotais: number = 0;

  isLoading: boolean = true;

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    const userId = this.authService.getUserId();

    if (userId) {
      this.isLoading = true;

      // 1. Carregar dados pessoais do entregador
      this.entregadorService.buscarPorId(userId).subscribe({
        next: (dados) => {
          this.entregador = dados;
          if (dados.avaliacaoMediaEntregador) {
            this.avaliacaoMedia = dados.avaliacaoMediaEntregador;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar perfil do entregador:', err);
          this.isLoading = false;
        }
      });

      // 2. Carregar estatísticas do dashboard
      this.entregaService.obterDashboardEntregador(userId).subscribe({
        next: (dashboard) => {
          if (dashboard) {
            this.totalEntregas = dashboard.totalEntregas || 0;
            this.ganhosTotais = dashboard.ganhos || dashboard.faturamentoTotal || 0;
            // Se o dashboard retornar avaliação, atualize aqui também
            if (dashboard.avaliacaoMedia) {
                this.avaliacaoMedia = dashboard.avaliacaoMedia;
            }
          }
        },
        error: (err) => console.error('Erro ao carregar dashboard no perfil:', err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}


