import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';
import { ProdutoRestaurante } from '../produto-restaurante/produto-restaurante';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;  // ← ADICIONEI AQUI
}

@Component({
  selector: 'app-perfil-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, PedidoRestauranteComponent, ProdutoRestaurante],
  templateUrl: './perfil-restaurante.html',
  styleUrl: './perfil-restaurante.scss',
})
export class PerfilRestaurante {
  
  tabAtiva: string = 'pedidos';
  mostrarModal: boolean = false;
  modoEdicao: boolean = false;

  pedidos = [
    {
      id: 1,
      cliente: 'João Silva',
      endereco: 'Rua 1, Centro',
      hora: '12:30',
      pagamento: 'Cartão de Crédito',
      subtotal: 54.90,
      taxaEntrega: 5.00,
      total: 59.90,
      status: 'novo',
      itens: [
        { 
          nome: 'Pizza Margherita', 
          quantidade: 1, 
          preco: 45.90,
          imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
        },
        { 
          nome: 'Refrigerante 2L', 
          quantidade: 1, 
          preco: 9.00,
          imagem: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'
        }
      ]
    },
    {
      id: 2,
      cliente: 'Maria Oliveira',
      endereco: 'Av. Brasil, 200',
      hora: '12:45',
      pagamento: 'Dinheiro',
      subtotal: 37.50,
      taxaEntrega: 5.00,
      total: 42.50,
      status: 'novo',
      itens: [
        { 
          nome: 'Pizza Calabresa', 
          quantidade: 1, 
          preco: 37.50,
          imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'
        }
      ]
    }
  ];

  produtos: Produto[] = [
    {
      id: 1,
      nome: 'Pizza Margherita',
      descricao: 'Molho de tomate, mussarela, manjericão',
      preco: 45.90,
      imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      categoria: 'Pizzas'  
    },
    {
      id: 2,
      nome: 'Pizza Calabresa',
      descricao: 'Molho, mussarela, calabresa, cebola',
      preco: 48.90,
      imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      categoria: 'Pizzas'  
    },
    {
      id: 3,
      nome: 'Refrigerante 2L',
      descricao: 'Coca-Cola, Guaraná ou Fanta',
      preco: 8.90,
      imagem: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
      categoria: 'Bebidas'  
    }
  ];

  produtoAtual: Produto = {
    id: 0,
    nome: '',
    descricao: '',
    preco: 0,
    imagem: '',
    categoria: ''  
  };

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

  abrirModalAdicionar() {
    this.modoEdicao = false;
    this.produtoAtual = {
      id: 0,
      nome: '',
      descricao: '',
      preco: 0,
      imagem: '',
      categoria: ''  
    };
    this.mostrarModal = true;
  }

  editarProduto(produto: Produto) {
    this.modoEdicao = true;
    this.produtoAtual = { ...produto };
    this.mostrarModal = true;
  }

  removerProduto(id: number) {
    if (confirm('Deseja realmente remover este produto?')) {
      this.produtos = this.produtos.filter(p => p.id !== id);
      this.atualizarContadores();
    }
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  salvarProduto() {
    if (!this.produtoAtual.nome || !this.produtoAtual.descricao || this.produtoAtual.preco <= 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (this.modoEdicao) {
      const index = this.produtos.findIndex(p => p.id === this.produtoAtual.id);
      if (index !== -1) {
        this.produtos[index] = { ...this.produtoAtual };
      }
    } else {
      this.produtoAtual.id = Math.max(...this.produtos.map(p => p.id), 0) + 1;
      this.produtos.push({ ...this.produtoAtual });
    }

    this.atualizarContadores();
    this.fecharModal();
  }

  atualizarContadores() {
    this.cardData[2].value = this.produtos.length;
  }
}