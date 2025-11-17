import { Component } from '@angular/core';
import { ItemCardapio } from '../../components/item-cardapio/item-cardapio';
import { ItemCarrinho } from '../../components/item-carrinho/item-carrinho';

@Component({
  selector: 'app-carrinho',
  imports: [ItemCardapio, ItemCarrinho],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho {
  vazio: boolean = false;
}
