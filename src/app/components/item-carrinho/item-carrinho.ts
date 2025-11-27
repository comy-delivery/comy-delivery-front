import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPedido } from '../../Shared/models/ItemPedido';
import { CarrinhoService } from '../../services/carrinho-service';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-item-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-carrinho.html',
  styleUrls: ['./item-carrinho.scss'],
})
export class ItemCarrinho implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private produtoService = inject(ProdutoService);

  @Input({ required: true }) item!: ItemPedido;
  @Input({ required: true }) index!: number;

  imagemUrl: string | null = null;

  ngOnInit(): void {
    if (this.item.produto.idProduto) {
      this.carregarImagem(this.item.produto.idProduto);
    }
  }

  carregarImagem(id: number) {
    this.produtoService.itemImagem(id).subscribe({
      next: (blob) => {
        this.imagemUrl = URL.createObjectURL(blob);
      },
      error: () => {
        this.imagemUrl = 'assets/img/sem-imagem.png';
      },
    });
  }

  aumentarQuantidade() {
    this.item.qtQuantidade++;
    this.recalcularTotal();
  }

  diminuirQuantidade() {
    if (this.item.qtQuantidade > 1) {
      this.item.qtQuantidade--;
      this.recalcularTotal();
    }
  }

  removerItem() {
    this.carrinhoService.remover(this.index);
  }

  private recalcularTotal() {
    // Preço do Produto
    const precoProduto = Number(this.item.vlPrecoUnitario);

    // Soma dos Adicionais
    const precoAdicionais = this.item.adicionais.reduce(
      (acc, ad) => acc + Number(ad.vlPrecoAdicional),
      0
    );

    // Atualiza o subtotal do item: (Produto + Adicionais) * Quantidade
    this.item.vlSubtotal = (precoProduto + precoAdicionais) * this.item.qtQuantidade;
  }
}
