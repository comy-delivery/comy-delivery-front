import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';
import { ProdutoRestaurante } from '../produto-restaurante/produto-restaurante';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';
import { Pedido } from '../../Shared/models/Pedido';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, PedidoRestauranteComponent, ProdutoRestaurante],
  templateUrl: './perfil-restaurante.html',
  styleUrls: ['./perfil-restaurante.scss'],
})
export class PerfilRestaurante implements OnInit {
  private restauranteService = inject(RestauranteService);
  private route = inject(ActivatedRoute);

  logoUrl: string | null = null;
  bannerUrl: string | null = null;

  produtos: any[] = [];
  pedidos: Pedido[] = [];
  tabAtiva: 'pedidos' | 'produtos' = 'pedidos';
  mostrarModal = false;
  modoEdicao = false;
  produtoAtual: any = {};
  adicionaisTemporarios: any[] = [];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id) {
      this.loadAllForRestaurante(id);
    } else if (this.Restaurante && this.Restaurante.id) {
      this.loadAllForRestaurante(this.Restaurante.id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Restaurante'] && this.Restaurante && this.Restaurante.id) {
      this.loadAllForRestaurante(this.Restaurante.id);
    }
  }

  private loadAllForRestaurante(id: number) {
    this.restauranteService.buscarRestaurantePorId(id).subscribe({
      next: (rest) => {
        this.Restaurante = rest;
      },
      error: (err) => console.error('Erro ao buscar restaurante:', err),
    });

    this.restauranteService.listarProdutos(id).subscribe({
      next: (prods) => (this.produtos = prods),
      error: (err) => console.error('Erro ao listar produtos:', err),
    });

    this.restauranteService.listarPedidos(id).subscribe({
      next: (peds) => (this.pedidos = peds),
      error: (err) => console.error('Erro ao listar pedidos:', err),
    });

    this.carregarLogo(id);
    this.carregarBanner(id);
  }

  carregarLogo(id: number) {
    this.restauranteService.restauranteLogo(id).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.restauranteBanner(id).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  @Input() Restaurante: Restaurante = {} as Restaurante;
  @Input() pedidosInput: Pedido[] = [];

  // UI helpers
  ativarTab(tab: 'pedidos' | 'produtos') {
    this.tabAtiva = tab;
  }

  abrirModalAdicionar() {
    this.modoEdicao = false;
    this.produtoAtual = {};
    this.adicionaisTemporarios = [];
    this.mostrarModal = true;
  }

  getCountByStatus(status: string): number {
    return this.pedidos ? this.pedidos.filter((p) => p.status === status).length : 0;
  }

  getCountByStatuses(statuses: string[]): number {
    return this.pedidos ? this.pedidos.filter((p) => statuses.includes(p.status)).length : 0;
  }

  getReceitaHoje(): string {
    if (!this.pedidos || this.pedidos.length === 0) return '0.00';
    const hoje = new Date().toISOString().slice(0, 10);
    const soma = this.pedidos
      .filter((p) => p.dtCriacao?.startsWith(hoje) && p.status === 'ENTREGUE')
      .reduce((acc, p) => acc + (Number((p as any).vlTotal) || 0), 0);
    return soma.toFixed(2);
  }

  confirmRemover(prodId: number) {
    if (confirm('Confirma remoção do produto?')) {
      this.removerProduto(prodId);
    }
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  salvarProduto() {
    const restauranteId = this.Restaurante?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    if (!restauranteId) {
      console.error('Restaurante não definido para salvar produto');
      return;
    }

    if (this.modoEdicao && this.produtoAtual?.id) {
      this.restauranteService
        .atualizarProduto(restauranteId, this.produtoAtual.id, this.produtoAtual)
        .subscribe({
          next: (updated) => {
            const idx = this.produtos.findIndex((p) => p.id === updated.id);
            if (idx >= 0) this.produtos[idx] = updated;
            this.fecharModal();
          },
          error: (err) => console.error('Erro ao atualizar produto:', err),
        });
    } else {
      this.restauranteService.criarProduto(restauranteId, this.produtoAtual).subscribe({
        next: (created) => {
          this.produtos.push(created);
          this.fecharModal();
        },
        error: (err) => console.error('Erro ao criar produto:', err),
      });
    }
  }

  adicionarNovoAdicionalAoProduto() {
    this.adicionaisTemporarios.push({ nome: '', preco: 0, descricao: '' });
  }

  removerAdicionalTemporario(index: number) {
    this.adicionaisTemporarios.splice(index, 1);
  }

  editarProduto(prod: any) {
    this.modoEdicao = true;
    this.produtoAtual = { ...prod };
    this.mostrarModal = true;
  }

  removerProduto(prodOrId: any) {
    const id = typeof prodOrId === 'number' ? prodOrId : prodOrId?.id;
    const restauranteId = this.Restaurante?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    if (!restauranteId) {
      console.error('Restaurante não definido para remover produto');
      return;
    }
    if (!id) {
      console.error('Produto inválido para remoção', prodOrId);
      return;
    }

    this.restauranteService.removerProduto(restauranteId, id).subscribe({
      next: () => {
        this.produtos = this.produtos.filter((p) => p.id !== id);
      },
      error: (err) => console.error('Erro ao remover produto:', err),
    });
  }
}
