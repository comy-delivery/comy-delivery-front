import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Produto } from '../../Shared/models/Produto';
import { Adicional } from '../../Shared/models/Adicional';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-item-cardapio',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-cardapio.html',
  styleUrl: './item-cardapio.scss',
})
export class ItemCardapio implements OnInit {
  ngOnInit(): void {
    this.carregarLogo(this.Produto.idProduto);
  }

  private produtoService = inject(ProdutoService);

  imagemUrl: string | null = null;

  carregarLogo(id: number) {
    this.produtoService.itemImagem(this.Produto.idProduto).subscribe({
      next: (blob) => {
        this.imagemUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  @Input({ required: true }) Produto = {} as Produto;

  showModal = false;
  adicionaisSelecionados: Adicional[] = [];
  observacao = '';
  quantidade = 1;

  abrirModalAdicionais() {
    this.showModal = true;
    this.adicionaisSelecionados = [];
    this.observacao = '';
    this.quantidade = 1;
  }

  fecharModal() {
    this.showModal = false;
  }

  toggleAdicional(adicional: Adicional) {
    const index = this.adicionaisSelecionados.findIndex(a => a.id === adicional.id);
    if (index > -1) {
      this.adicionaisSelecionados.splice(index, 1);
    } else {
      this.adicionaisSelecionados.push(adicional);
    }
  }

  isAdicionalSelecionado(id: number): boolean {
    return this.adicionaisSelecionados.some(a => a.id === id);
  }

  aumentarQuantidade() {
    this.quantidade++;
  }

  diminuirQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  calcularTotal(): number {
    let total = this.Produto.vlPreco;
    this.adicionaisSelecionados.forEach(adicional => {
      total += adicional.preco;
    });
    return total * this.quantidade;
  }

  adicionarAoCarrinho() {
    const itemCarrinho = {
      produto: this.Produto,
      adicionais: this.adicionaisSelecionados,
      observacao: this.observacao,
      quantidade: this.quantidade,
      precoTotal: this.calcularTotal()
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    carrinho.push(itemCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert('Produto adicionado ao carrinho!');
    this.fecharModal();
  }
}