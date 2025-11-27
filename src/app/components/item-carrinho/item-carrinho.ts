import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-carrinho',
  imports: [CommonModule],
  templateUrl: './item-carrinho.html',
  styleUrl: './item-carrinho.scss',
})
export class ItemCarrinho {
  @Input() item: any; 
}