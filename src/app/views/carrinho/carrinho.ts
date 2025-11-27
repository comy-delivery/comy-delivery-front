import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ItemCardapio } from '../../components/item-cardapio/item-cardapio';
import { ItemCarrinho } from '../../components/item-carrinho/item-carrinho';
import { ItemPedido } from '../../Shared/models/ItemPedido';
import { CarrinhoService } from '../../services/carrinho-service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, ItemCardapio, ItemCarrinho, RouterLink, FormsModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho implements OnInit, OnDestroy {
  private carrinhoService = inject(CarrinhoService);

  // Variável para gerenciar a inscrição na memória
  private subscription!: Subscription;

  itemsCarrinho: ItemPedido[] = [];
  taxaEntrega: number = 5.9;

  ngOnInit(): void {
    this.subscription = this.carrinhoService.itensCarrinho$.subscribe((itens) => {
      this.itemsCarrinho = itens;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get vazio(): boolean {
    return this.itemsCarrinho.length === 0;
  }

  get subtotal(): number {
    return this.itemsCarrinho.reduce((total, item) => total + item.vlSubtotal, 0);
  }

  get total(): number {
    return this.subtotal + this.taxaEntrega;
  }
}
