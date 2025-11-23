import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;  
}

@Component({
  selector: 'app-produto-restaurante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produto-restaurante.html',
  styleUrl: './produto-restaurante.scss',
})
export class ProdutoRestaurante {
  @Input() produto!: Produto;
  @Output() onEditar = new EventEmitter<Produto>();
  @Output() onRemover = new EventEmitter<number>();

  editar() {
    this.onEditar.emit(this.produto);
  }

  remover() {
    this.onRemover.emit(this.produto.id);
  }

 
  editarProduto() {
    this.editar();
  }

  removerProduto() {
    this.remover();
  }
}