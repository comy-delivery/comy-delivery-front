import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto-service';
import { Produto } from '../../Shared/models/Produto';

interface Adicional {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
}

@Component({
  selector: 'app-produto-restaurante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produto-restaurante.html',
  styleUrl: './produto-restaurante.scss',
})
export class ProdutoRestaurante implements OnInit {
  ngOnInit(): void {
    this.carregarImg(this.produto.idProduto);
  }
  
  @Input({ required: true }) produto = {} as Produto;
  // ❌ REMOVIDO: @Output() onEditar
  @Output() remover = new EventEmitter<number>();

  private produtoService = inject(ProdutoService);

  imagemUrl: string | null = null;

  carregarImg(id: number) {
    this.produtoService.itemImagem(this.produto.idProduto).subscribe({
      next: (blob) => {
        this.imagemUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  // ❌ REMOVIDO: método editarProduto()

  removerProduto() {
    console.log('🗑️ Tentando remover produto:', this.produto.idProduto);
    console.log('📦 Produto completo:', this.produto);
    this.remover.emit(this.produto.idProduto);
  }

  contarAdicionais(): number {
    return this.produto.adicionais?.length || 0;
  }

  temAdicionais(): boolean {
    return this.contarAdicionais() > 0;
  }
}