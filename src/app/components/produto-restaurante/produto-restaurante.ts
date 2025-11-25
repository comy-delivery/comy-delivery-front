import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Adicional {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  adicionais?: Adicional[];
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

  editarProduto() {
    this.onEditar.emit(this.produto);
  }

  removerProduto() {
    this.onRemover.emit(this.produto.id);
  }

  contarAdicionais(): number {
    return this.produto.adicionais?.length || 0;
  }

  temAdicionais(): boolean {
    return this.contarAdicionais() > 0;
  }
}