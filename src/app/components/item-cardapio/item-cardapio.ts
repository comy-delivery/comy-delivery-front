import { Component, inject, Input, OnInit } from '@angular/core';

import { Produto } from '../../Shared/models/Produto';
import { ProdutoService } from '../../services/produto-service';

@Component({
  selector: 'app-item-cardapio',
  imports: [],
  templateUrl: './item-cardapio.html',
  styleUrl: './item-cardapio.scss',
})
export class ItemCardapio implements OnInit {
  ngOnInit(): void {
    this.carregarLogo(this.Produto.idProduto);
  }

  private produtoService = inject(ProdutoService);

  imagemUrl: string | null = null;

  carregarLogo(id: number) {
    this.produtoService.itemImagem(this.Produto.idProduto).subscribe({
      next: (blob) => {
        this.imagemUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  @Input({ required: true }) Produto = {} as Produto;
}
