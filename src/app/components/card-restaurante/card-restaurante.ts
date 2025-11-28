import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';

@Component({
  selector: 'app-card-restaurante',
  imports: [RouterLink],
  templateUrl: './card-restaurante.html',
  styleUrl: './card-restaurante.scss',
})
export class CardRestaurante implements OnInit {
  ngOnInit(): void {
    this.carregarLogo(this.Restaurante.id!);
    this.carregarBanner(this.Restaurante.id!);
  }
  private restauranteService = inject(RestauranteService);

  logoUrl: string | null = null;
  bannerUrl: string | null = null;

  carregarLogo(id: number) {
    this.restauranteService.restauranteLogo(this.Restaurante.id!).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.restauranteBanner(this.Restaurante.id!).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  @Input({ required: true }) Restaurante = {} as Restaurante;
}
