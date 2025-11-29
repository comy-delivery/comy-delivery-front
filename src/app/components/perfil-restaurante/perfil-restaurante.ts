import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';
import { ProdutoRestaurante } from '../produto-restaurante/produto-restaurante';
import { Restaurante } from '../../Shared/models/Restaurante';
import { Pedido } from '../../Shared/models/Pedido';
import { ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante-service';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-perfil-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, PedidoRestauranteComponent, ProdutoRestaurante],
  templateUrl: './perfil-restaurante.html',
  styleUrls: ['./perfil-restaurante.scss'],
})
export class PerfilRestaurante implements OnInit, OnChanges {
  private restauranteService = inject(RestauranteService);
  private route = inject(ActivatedRoute);
  private produtoService = inject(ProdutoService);
  private id_fixo = 2;

  @Input() Restaurante: Restaurante = {} as Restaurante;
  @Input() pedidosInput: Pedido[] = [];

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
    const id = this.id_fixo;
    this.loadAllForRestaurante(id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Restaurante'] && this.Restaurante && this.Restaurante.id) {
      this.loadAllForRestaurante(this.Restaurante.id);
    }
  }

  private loadAllForRestaurante(id: number) {
    // Buscar restaurante
    this.restauranteService.buscarRestaurantePorId(id).subscribe({
      next: (rest) => {
        this.Restaurante = rest;
        console.log('PerfilRestaurante: restaurante carregado para id=', id, rest);
      },
      error: (err) => console.error('Erro ao buscar restaurante:', err),
    });

    // Listar produtos
    this.restauranteService.listarProdutosRestaurante(id).subscribe({
      next: (prods) => {
        this.produtos = prods;
        console.log('PerfilRestaurante: produtos carregados para id=', id, prods && prods.length);
      },
      error: (err) => console.error('Erro ao listar produtos:', err),
    });

    // Carregar imagens
    this.carregarLogo(id);
    this.carregarBanner(id);
  }

  carregarLogo(id: number) {
    this.restauranteService.buscarLogo(id).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('Erro ao carregar logo:', erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.buscarBanner(id).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('Erro ao carregar banner:', erro),
    });
  }

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

  //crud produtos

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

    // Montar objeto JSON para envio (remoção temporária do FormData)
    const produtoParaSalvar: any = {
      nmProduto: this.produtoAtual.nmProduto,
      dsProduto: this.produtoAtual.descricao ?? this.produtoAtual.dsProduto ?? '',
      categoriaProduto: this.produtoAtual.categoria ?? this.produtoAtual.categoriaProduto ?? '',
      vlPreco: Number(this.produtoAtual.preco ?? this.produtoAtual.vlPreco ?? 0),
      restauranteId: restauranteId,
      tempoPreparacao: this.produtoAtual.tempoPreparacao ?? null,
      isPromocao: this.produtoAtual.isPromocao ?? false,
      vlPrecoPromocional: this.produtoAtual.vlPrecoPromocional ?? null,
      adicionais: this.adicionaisTemporarios,
      // imagemProduto pode ser uma URL string se o usuário forneceu, caso contrário null
      imagemProduto: typeof this.produtoAtual.imagemProduto === 'string' ? this.produtoAtual.imagemProduto : null,
    };

    // ======================
    //   MODO EDIÇÃO
    // ======================
    if (this.modoEdicao && this.produtoAtual?.id) {
      const produtoId = this.produtoAtual.id;

      this.produtoService.atualizarProduto(produtoId, produtoParaSalvar).subscribe({
        next: (produtoAtualizado) => {
          const atualizadoId =
            (produtoAtualizado as any).id ?? (produtoAtualizado as any).idProduto ?? produtoId;

          const idx = this.produtos.findIndex(
            (p) => (p as any).id === atualizadoId || (p as any).idProduto === atualizadoId
          );

          if (idx >= 0) {
            this.produtos[idx] = produtoAtualizado;
          } else {
            this.produtos.unshift(produtoAtualizado);
          }

          // reset
          this.mostrarModal = false;
          this.modoEdicao = false;
          this.produtoAtual = {};
          this.adicionaisTemporarios = [];
        },

        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
        },
      });

      return;
    }

    // ======================
    //   MODO CADASTRO
    // ======================
    this.produtoService.adicionarProduto(produtoParaSalvar).subscribe({
      next: (novo) => {
        this.produtos.push(novo);

        this.mostrarModal = false;
        this.produtoAtual = {};
        this.adicionaisTemporarios = [];
      },

      error: (err) => {
        console.error('Erro ao adicionar produto:', err);
      },
    });
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
        this.produtos = this.produtos.filter((p) => ((p as any).id ?? (p as any).idProduto) !== id);
      },
      error: (err) => console.error('Erro ao remover produto:', err),
    });
  }
}