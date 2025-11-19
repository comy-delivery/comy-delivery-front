import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pedido-restaurante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-restaurante.html',
  styleUrl: './pedido-restaurante.scss'
})
export class PedidoRestauranteComponent {

  @Input() pedido: any;
  pedidoVisivel = true;
  mostrarDetalhes = false;

  recusarPedido() {
    this.pedidoVisivel = false;
  }

  aceitarPedido() {
    this.mostrarDetalhes = true;
  }

}