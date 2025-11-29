import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

  // Cache para guardar nomes/logos e evitar requisições repetidas
  restaurantesCache: { [key: number]: { nome: string, logoUrl: string } } = {};
  imagensProdutosCache: { [key: number]: string } = {};

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
          
          // Carrega infos extras (Restaurante e Entrega)
          this.carregarDadosRestaurantes();
          this.carregarDadosEntregas();
          this.carregarImagensProdutos();

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
      // 1. Busca a entrega vinculada ao pedido
      this.entregaService.buscarPorPedido(pedido.idPedido).subscribe({
        next: (entrega) => {
          if (!entrega) return;

          // Anexa a entrega ao objeto pedido
          pedido.entregaDetalhada = entrega;

          // 2. CORREÇÃO: Verifica se o objeto 'entregador' já veio dentro da entrega
          if (entrega.entregador) {
             // Se já tem o objeto, usa direto (evita outra requisição)
             pedido.entregadorDetalhado = entrega.entregador;
          } 
          // Fallback: Se vier apenas o ID (caso o backend use DTO plano)
          else if (entrega.entregadorId) {
            this.entregadorService.buscarPorId(entrega.entregadorId).subscribe({
              next: (entregador) => {
                pedido.entregadorDetalhado = entregador;
              },
              error: () => console.log(`Erro ao buscar entregador ID ${entrega.entregadorId}`)
            });
          }
        },
        error: () => {
            // Normal dar erro ou 404 se o pedido ainda não tem entrega (ex: PENDENTE)
        }
      });
    });
  }

  carregarDadosRestaurantes() {
    // CORREÇÃO: Acessa p.restaurante.id em vez de p.restauranteId
    const idsRestaurantes = [...new Set(this.pedidos
      .filter(p => p.restaurante && p.restaurante.id)
      .map(p => p.restaurante.id)
    )];
    
    idsRestaurantes.forEach(id => {
      if (!this.restaurantesCache[id]) {
        this.restaurantesCache[id] = { nome: 'Carregando...', logoUrl: '' };
        
        // Busca Nome
        this.restauranteService.buscarRestaurantePorId(id).subscribe({
          next: (rest) => {
             if(this.restaurantesCache[id]) this.restaurantesCache[id].nome = rest.nmRestaurante;
          }
        });

        // Busca Logo
        this.restauranteService.buscarLogo(id).subscribe({
          next: (blob) => {
            if(this.restaurantesCache[id]) this.restaurantesCache[id].logoUrl = URL.createObjectURL(blob);
          },
          error: () => { 
            this.restaurantesCache[id].logoUrl = 'assets/img/placeholder.png'; // Imagem padrão em caso de erro
          }
        });
      }
    });
  }

  carregarImagensProdutos() {
    this.pedidos.forEach(pedido => {
      pedido.itensPedido.forEach((item: any) => {
        const idProduto = item.produto.idProduto;
        
        // Se ainda não tem no cache, busca
        if (idProduto && !this.imagensProdutosCache[idProduto]) {
          // Define um placeholder temporário ou vazio
          this.imagensProdutosCache[idProduto] = 'assets/img/loading.png'; 
          
          this.produtoService.itemImagem(idProduto).subscribe({
            next: (blob) => {
              this.imagensProdutosCache[idProduto] = URL.createObjectURL(blob);
            },
            error: () => {
              // Imagem de fallback em caso de erro
              this.imagensProdutosCache[idProduto] = 'assets/img/sem-imagem.png'; 
            }
          });
        }
      });
    });
  }

  // Função auxiliar para o HTML pegar a imagem
  getProdutoImagem(id: number): string {
    return this.imagensProdutosCache[id] || 'assets/img/loading.png';
  }

  // CORREÇÃO: Recebe ID ou tenta pegar do objeto se o ID não for passado
  getRestauranteNome(id: number): string {
    return this.restaurantesCache[id]?.nome || 'Restaurante';
  }

  getRestauranteLogo(id: number): string {
    return this.restaurantesCache[id]?.logoUrl || 'assets/img/loading.png';
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
