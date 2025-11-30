import { Component, OnInit, inject } from '@angular/core';
import { EntregaDisponivel } from '../entrega-disponivel/entrega-disponivel';
import { EntregaService } from '../../services/entrega-service';

@Component({
  selector: 'app-painel-entregador',
  imports: [EntregaDisponivel],
  templateUrl: './painel-entregador.html',
  styleUrl: './painel-entregador.scss',
})
export class PainelEntregador implements OnInit {
  private entregaService = inject(EntregaService);

  entregasDisponiveis = 0;
  totalPedidosRealizados = 0; // contador de pedidos que o entregador realizou
  ganhoEstimado = 0; // soma do ganho/valor/pedido.total para entregas disponíveis
  formattedGanhoEstimado = '0.00';

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo() {
    this.entregaService.buscarEntregasDisponiveis().subscribe({
      next: (res) => {
        const entregas = res || [];
        this.entregasDisponiveis = entregas.length;

        // calcular soma dos ganhos estimados para entregas disponíveis
        let somaGanho = 0;

        entregas.forEach((e: any) => {
          const ganho = parseFloat((e.ganho ?? e.valor ?? e.pedido?.total ?? 0) as any) || 0;
          somaGanho += ganho;
        });

        this.ganhoEstimado = somaGanho;
        this.formattedGanhoEstimado = this.formatMoney(this.ganhoEstimado);

        // Buscar quantidade total de entregas já realizadas pelo entregador (histórico)
        this.entregaService.buscarEntregasRealizadas().subscribe({
          next: (hist) => {
            const historico = hist || [];
            this.totalPedidosRealizados = historico.length;
          },
          error: (err) => {
            console.warn('Não foi possível obter histórico de entregas do entregador:', err);
            this.totalPedidosRealizados = 0;
          },
        });
      },
      error: (err) => console.error('Erro ao buscar entregas para resumo:', err),
    });
  }

  private formatMoney(value: number): string {
    return (Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2);
  }
}
