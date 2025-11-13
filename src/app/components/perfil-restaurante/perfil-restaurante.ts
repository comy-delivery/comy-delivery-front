import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-restaurante',
  imports: [CommonModule],
  templateUrl: './perfil-restaurante.html',
  styleUrl: './perfil-restaurante.scss',
})
export class PerfilRestaurante {
  cardData: any[] = [
    { 
      title: 'Novos Pedidos',
      value: 2,
      icon: '©',
      iconColor: '#ffc107'
    },
    { 
      title: 'Em Preparo',
      value: 0,
      icon: '⏲️',
      iconColor: '#28a745'
    },
    { 
      title: 'Produtos',
      value: 3,
      icon: '🍕',
      iconColor: '#dc3545'
    },
    { 
      title: 'Receita Hoje',
      value: 'R$ 159,40',
      icon: '$',
      iconColor: 'greenyellow'
    }
  ];
} 