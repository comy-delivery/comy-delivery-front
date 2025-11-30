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
  imports: [ FormsModule, CommonModule],
  templateUrl: './perfil-entregador.html',
  styleUrl: './perfil-entregador.scss',
})
export class PerfilEntregador implements OnInit {

  private entregadorService = inject(EntregadorService);
  private entregaService = inject(EntregaService);
  private authService = inject(AuthService);

  entregador: Entregador | null = null;

  // Controle de Edição
  mostrarModalEdicao: boolean = false;
  entregadorEdit: any = {};
  isSaving: boolean = false;
  
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

          this.entregadorEdit = { ...dados };

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
        next: (dashboard: any) => {
          console.log('📊 Dashboard recebido:', dashboard);
          if (dashboard) {
            // Mapeamento corrigido conforme o JSON fornecido
            this.totalEntregas = dashboard.quantidadeTotalEntregas || 0;
            this.ganhosTotais = dashboard.valorTotalRecebido || 0;
          }
        },
        error: (err) => {
           console.warn('⚠️ Dashboard indisponível, calculando manualmente...', err);
           // Fallback: Busca lista de entregas realizadas para somar
           this.entregaService.buscarEntregasRealizadas().subscribe({
             next: (lista: any[]) => {
               if (lista) {
                 this.totalEntregas = lista.length;
                 this.ganhosTotais = lista.reduce((acc, curr) => acc + (curr.valorEntrega || curr.valor || 0), 0);
               }
             }
           });}});
    }
  }

  // --- Edição ---

  abrirModalEdicao() {
    this.mostrarModalEdicao = true;
    // Recarrega o objeto editável com os dados atuais para garantir
    if (this.entregador) {
      this.entregadorEdit = { ...this.entregador };
    }
  }

  fecharModalEdicao() {
    this.mostrarModalEdicao = false;
  }

  salvarEdicao() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isSaving = true;

    // Chama endpoint de atualização
    this.entregadorService.atualizar(userId, this.entregadorEdit).subscribe({
      next: (dadosAtualizados) => {
        console.log('✅ Perfil atualizado:', dadosAtualizados);
        this.entregador = dadosAtualizados; // Atualiza a view
        this.isSaving = false;
        this.fecharModalEdicao();
        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar perfil:', err);
        this.isSaving = false;
        alert('Erro ao atualizar perfil. Verifique os dados.');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}


