import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Produto } from '../../Shared/models/Produto';
import { Adicional } from '../../Shared/models/Adicional';
import { ProdutoService } from '../../services/produto-service';
import { AdicionalService } from '../../services/adicional-service'; 
import { ItemPedido } from '../../Shared/models/ItemPedido';
import { CarrinhoService } from '../../services/carrinho-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-item-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-cardapio.html',
  styleUrl: './item-cardapio.scss',
})
export class ItemCardapio implements OnInit {
  private produtoService = inject(ProdutoService);
  private adicionalService = inject(AdicionalService); 
  private carrinhoService = inject(CarrinhoService);
  private authService = inject(AuthService); // <--- INJETAR
  private router = inject(Router);

  @Input({ required: true }) Produto = {} as Produto;

  imagemUrl: string | null = null;

  // Controle do Modal e Listas
  showModal = false;
  adicionaisDisponiveis: Adicional[] = []; 
  adicionaisSelecionados: Adicional[] = []; 

  // Controle do Carrinho
  observacao = '';
  quantidade = 1;
  isLoadingAdicionais = false; 

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

    if (!this.authService.isLoggedIn()) {
        alert('Faça login para personalizar seu pedido!');
        this.router.navigate(['/login']);
        return;
    }

    
    this.showModal = true;
    this.resetaFormulario();
    this.carregarAdicionais();
  }

  fecharModal() {
    this.showModal = false;
  }

  private resetaFormulario() {
    this.adicionaisSelecionados = []; 
    this.observacao = '';
    this.quantidade = 1;
    this.adicionaisDisponiveis = []; 
  }


  carregarAdicionais() {
    this.isLoadingAdicionais = true;

    if (!this.Produto || !this.Produto.idProduto) {
        console.error("Produto inválido para buscar adicionais");
        this.isLoadingAdicionais = false;
        return;
    }

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

 
    this.adicionaisSelecionados.forEach((adicional) => {
      total += Number(adicional.vlPrecoAdicional);
    });

    return total * this.quantidade;
  }

  adicionarAoCarrinho() {
    const novoItem: ItemPedido = {
      produto: this.Produto,
      qtQuantidade: this.quantidade,
      vlPrecoUnitario: this.Produto.vlPreco,
      vlSubtotal: this.calcularTotal(),
      dsObservacao: this.observacao,
      adicionais: this.adicionaisSelecionados,
    };

    this.carrinhoService.adicionar(novoItem);

    this.fecharModal();
  }
}
