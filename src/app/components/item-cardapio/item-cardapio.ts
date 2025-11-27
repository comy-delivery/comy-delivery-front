import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Produto } from '../../Shared/models/Produto';
import { Adicional } from '../../Shared/models/Adicional'; // <--- COMENTADO
import { ProdutoService } from '../../services/produto-service';
import { AdicionalService } from '../../services/adicional-service'; // <--- COMENTADO

@Component({
  selector: 'app-item-cardapio',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-cardapio.html',
  styleUrl: './item-cardapio.scss',
})
export class ItemCardapio implements OnInit {
  private produtoService = inject(ProdutoService);
  private adicionalService = inject(AdicionalService); // <--- COMENTADO

  @Input({ required: true }) Produto = {} as Produto;

  imagemUrl: string | null = null;

  // Controle do Modal e Listas
  showModal = false;
  adicionaisDisponiveis: Adicional[] = []; // <--- COMENTADO
  adicionaisSelecionados: Adicional[] = []; // <--- COMENTADO

  // Controle do Carrinho
  observacao = '';
  quantidade = 1;
  isLoadingAdicionais = false; // <--- COMENTADO

  ngOnInit(): void {
    this.carregarLogo(this.Produto.idProduto);
  }

  carregarLogo(id: number) {
    this.produtoService.itemImagem(id).subscribe({
      next: (blob) => {
        this.imagemUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  // Lógica do Modal
  abrirModalAdicionais() {
    this.showModal = true;
    this.resetaFormulario();
    this.carregarAdicionais(); // <--- COMENTADO
  }

  fecharModal() {
    this.showModal = false;
  }

  private resetaFormulario() {
    this.adicionaisSelecionados = []; // <--- COMENTADO
    this.observacao = '';
    this.quantidade = 1;
    this.adicionaisDisponiveis = []; // <--- COMENTADO
  }

  // BLOCO INTEIRO COMENTADO
  carregarAdicionais() {
    this.isLoadingAdicionais = true;
    this.adicionalService.buscarAdicionaisPorProduto(this.Produto.idProduto).subscribe({
      next: (resposta) => {
        this.adicionaisDisponiveis = resposta as Adicional[];
        this.isLoadingAdicionais = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar adicionais:', erro);
        this.isLoadingAdicionais = false;
      },
    });
  }

  // Lógica de Seleção e Cálculo

  // <--- BLOCO INTEIRO COMENTADO
  toggleAdicional(adicional: Adicional) {
    if (!adicional.isDisponivel) return;

    const index = this.adicionaisSelecionados.findIndex(
      (a) => a.idAdicional === adicional.idAdicional
    );

    if (index > -1) {
      this.adicionaisSelecionados.splice(index, 1);
    } else {
      this.adicionaisSelecionados.push(adicional);
    }
  }

  isAdicionalSelecionado(id: number): boolean {
    return this.adicionaisSelecionados.some((a) => a.idAdicional === id);
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

    // <--- CÁLCULO DE ADICIONAIS COMENTADO

    this.adicionaisSelecionados.forEach((adicional) => {
      total += Number(adicional.vlPrecoAdicional);
    });

    return total * this.quantidade;
  }

  adicionarAoCarrinho() {
    const itemCarrinho = {
      produto: this.Produto,
      adicionais: this.adicionaisSelecionados, // <--- COMENTADO PARA NÃO DAR ERRO
      observacao: this.observacao,
      quantidade: this.quantidade,
      precoTotal: this.calcularTotal(),
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    carrinho.push(itemCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert('Produto adicionado ao carrinho!');
    this.fecharModal();
  }
}
