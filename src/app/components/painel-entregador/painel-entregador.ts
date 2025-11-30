import { Component, OnInit, inject } from '@angular/core';
import { EntregaDisponivel } from '../entrega-disponivel/entrega-disponivel';
import { EntregaService } from '../../services/entrega-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-painel-entregador',
  standalone: true,
  imports: [EntregaDisponivel],
  templateUrl: './painel-entregador.html',
  styleUrl: './painel-entregador.scss',
})
export class PainelEntregador implements OnInit {
  private entregaService = inject(EntregaService);
  private authService = inject(AuthService);

  entregasDisponiveis = 0;
  totalPedidosRealizados = 0; // contador de pedidos que o entregador realizou
  ganhoEstimado = 0; // soma do ganho/valor/pedido.total para entregas disponíveis
  formattedGanhoEstimado = '0.00';

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo() {
    const userId = this.authService.getUserId();

    // 1. Carrega entregas disponíveis para calcular ganho estimado e contagem atual
    this.entregaService.buscarEntregasDisponiveis().subscribe({
      next: (res) => {
        const entregas = res || [];
        this.entregasDisponiveis = entregas.length;

        let somaGanho = 0;
        entregas.forEach((e: any) => {
          const ganho = parseFloat((e.ganho ?? e.valor ?? e.pedido?.total ?? 0) as any) || 0;
          somaGanho += ganho;
        });

        this.ganhoEstimado = somaGanho;
        this.formattedGanhoEstimado = this.formatMoney(this.ganhoEstimado);
      },
      error: (err) => console.error('Erro ao buscar entregas disponíveis:', err),
    });

    // 2. Tenta carregar estatísticas do Dashboard (Total realizado)
    if (userId) {
      this.entregaService.obterDashboardEntregador(userId).subscribe({
        next: (dashboard) => {
          // Ajuste as propriedades conforme o retorno exato do seu backend
          if (dashboard) {
             this.totalPedidosRealizados = dashboard.totalEntregas || dashboard.qtdEntregas || 0;
          }
        },
        error: (err) => {
           console.warn('Dashboard não disponível, usando fallback de lista realizada', err);
           // Fallback: conta manualmente se o endpoint de dashboard falhar
           this.entregaService.buscarEntregasRealizadas().subscribe({
              next: (hist) => this.totalPedidosRealizados = hist ? hist.length : 0
           });
        }
      });
    }
  }

  private formatMoney(value: number): string {
    return (Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2);
  }
}
