import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
imports: [CommonModule, PedidoRestauranteComponent]

import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';


@Component({
  selector: 'app-perfil-restaurante',
  standalone: true,

  imports: [CommonModule, PedidoRestauranteComponent],

  templateUrl: './perfil-restaurante.html',
  styleUrl: './perfil-restaurante.scss',
})
export class PerfilRestaurante {
  
  tabAtiva: string = 'pedidos';

  pedidos = [
    {
      id: 1,
      cliente: 'João Silva',
      endereco: 'Rua 1, Centro',
      total: 59.90,
      status: 'novo'
    },
    {
      id: 2,
      cliente: 'Maria Oliveira',
      endereco: 'Av. Brasil, 200',
      total: 42.50,
      status: 'novo'
    }
  ];

  cardData: any[] = [
    { title: 'Novos Pedidos', value: 2, icon: '©', iconColor: '#ffc107' },
    { title: 'Em Preparo', value: 0, icon: '⏲️', iconColor: '#28a745' },
    { title: 'Produtos', value: 3, icon: '🍕', iconColor: '#dc3545' },
    { title: 'Receita Hoje', value: 'R$ 159,40', icon: '$', iconColor: 'greenyellow' }
  ];

  switchTab(tab: string) {
    this.tabAtiva = tab;
    console.log("Tab selecionada:", tab);
  }

}
