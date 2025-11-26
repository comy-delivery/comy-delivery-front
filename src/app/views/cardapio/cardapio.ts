import { Component, inject, Input, OnInit } from '@angular/core';
import { ItemCardapio } from '../../components/item-cardapio/item-cardapio';
import { Produto } from '../../Shared/models/Produto';
import { ProdutoService } from '../../services/produto-service';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cardapio',
  imports: [ItemCardapio],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.scss',
})
export class Cardapio implements OnInit {
  private produtoService = inject(ProdutoService);
  private restauranteService = inject(RestauranteService);
  private route = inject(ActivatedRoute);
  idRestaurante!: number;

  @Input() id!: string;

  ngOnInit(): void {
    const idUrl = this.route.snapshot.paramMap.get('id');

    if (idUrl) {
      this.idRestaurante = Number(idUrl);
      this.produtoService.buscarProdutos(this.idRestaurante).subscribe({
        next: (response) => {
          this.produtos = response;
        },
        error: (erro) => console.error(erro),
      });
      this.restauranteService.buscarRestaurantePorId(this.idRestaurante).subscribe({
        next: (restaurante) => {
          this.Restaurante = restaurante;
        },
        error: (erro) => console.error(erro),
      });
      this.carregarBanner(this.idRestaurante);
      this.carregarLogo(this.idRestaurante);
    }
  }

  logoUrl: string | null = null;
  bannerUrl: string | null = null;

  carregarLogo(id: number) {
    this.restauranteService.restauranteLogo(this.idRestaurante).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.restauranteBanner(this.idRestaurante).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  protected produtos: Produto[] = [];

  @Input({ required: true }) Restaurante = {} as Restaurante;
}
