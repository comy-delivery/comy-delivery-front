import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Pedido } from '../../Shared/models/Pedido';
import { StatusPedidoLabel } from '../../Shared/models/StatusPedido';
import { ProdutoService } from '../../services/produto-service';
import { PedidoService } from '../../services/pedido-service';
import { AuthService } from '../../services/auth-service';
import { RestauranteService } from '../../services/restaurante-service';
import { EntregadorService } from '../../services/entregador-service';
import { EntregaService } from '../../services/entrega-service';

@Component({
  selector: 'app-pedidos-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-cliente.html',
  styleUrl: './pedidos-cliente.scss',
})
export class PedidosCliente implements OnInit {

  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private restauranteService = inject(RestauranteService);
  private entregaService = inject(EntregaService);
  private entregadorService = inject(EntregadorService);
  
  private produtoService = inject(ProdutoService);

  restaurantesCache: { [key: number]: { nome: string, logoUrl: string } } = {};

  pedidos: any[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    const userId = this.authService.getUserId();
    
    if (userId) {
      this.loading = true;
      this.pedidoService.buscarPedidosPorCliente(userId).subscribe({
        next: (dados: any[]) => {
          this.pedidos = dados.sort((a, b) => {
            const dateA = a.dtCriacao ? new Date(a.dtCriacao).getTime() : 0;
            const dateB = b.dtCriacao ? new Date(b.dtCriacao).getTime() : 0;
            return dateB - dateA;
          });
          
          this.carregarDadosRestaurantes();
          
          // NOVO: Carregar dados de entrega e entregador para cada pedido
          this.carregarDadosEntregas();

          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar pedidos:', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  carregarDadosEntregas() {
    this.pedidos.forEach(pedido => {
      // Busca a entrega vinculada ao pedido
      this.entregaService.buscarPorPedido(pedido.idPedido).subscribe({
        next: (entrega) => {
          // Anexa a entrega ao objeto pedido para usar no HTML
          pedido.entregaDetalhada = entrega;

          // Se houver entregador vinculado, busca os dados dele
          if (entrega && entrega.entregadorId) {
            this.entregadorService.buscarPorId(entrega.entregadorId).subscribe({
              next: (entregador) => {
                // Anexa o entregador ao objeto pedido
                pedido.entregadorDetalhado = entregador;
              },
              error: () => console.log(`Entregador não encontrado para entrega ${entrega.idEntrega}`)
            });
          }
        },
        error: () => {
            // Pedido pode não ter entrega ainda (ex: pendente), normal falhar ou vir vazio
        }
      });
    });
  }

  carregarDadosRestaurantes() {
    const idsRestaurantes = [...new Set(this.pedidos.map(p => p.restauranteId))];
    
    idsRestaurantes.forEach(id => {
      if (!this.restaurantesCache[id]) {
        this.restaurantesCache[id] = { nome: 'Carregando...', logoUrl: '' };
        
        this.restauranteService.buscarRestaurantePorId(id).subscribe({
          next: (rest) => {
             if(this.restaurantesCache[id]) this.restaurantesCache[id].nome = rest.nmRestaurante;
          }
        });

        this.restauranteService.buscarLogo(id).subscribe({
          next: (blob) => {
            if(this.restaurantesCache[id]) this.restaurantesCache[id].logoUrl = URL.createObjectURL(blob);
          },
          error: () => { /* Tratar erro de imagem se necessário */ }
        });
      }
    });
  }

  getRestauranteNome(id: number): string {
    return this.restaurantesCache[id]?.nome || 'Restaurante';
  }

  getRestauranteLogo(id: number): string {
    return this.restaurantesCache[id]?.logoUrl || 'assets/img/placeholder.png';
  }

  getStatusLabel(status: string): string {
    // @ts-ignore
    return StatusPedidoLabel[status] || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDENTE': return 'text-bg-secondary';
      case 'CONFIRMADO': return 'text-bg-primary';
      case 'EM_PREPARO': return 'text-bg-warning';
      case 'PRONTO': return 'text-bg-info';
      case 'SAIU_PARA_ENTREGA': return 'text-bg-primary';
      case 'ENTREGUE': return 'text-bg-success';
      case 'CANCELADO': return 'text-bg-danger';
      default: return 'text-bg-secondary';
    }
  }
}