import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-restaurante',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './card-restaurante.html',
  styleUrl: './card-restaurante.scss',
})
export class CardRestaurante implements OnInit {
  private restauranteService = inject(RestauranteService);

  @Input({ required: true }) Restaurante = {} as Restaurante;

  @Input() distancia: number | null = null;
  @Input() mediaPreco: number | null = null;
  @Input() tempoEstimado: number | null = null;
  @Input() valorFrete: number | null = null;

  logoUrl: string | null = null;
  bannerUrl: string | null = null;


  ngOnInit(): void {
    console.log('🏪 Card Restaurante - ID:', this.Restaurante.id);
    console.log('🏪 Card Restaurante - Nome:', this.Restaurante.nmRestaurante);
    
    if (this.Restaurante.id) {
      this.carregarLogo(this.Restaurante.id);
      this.carregarBanner(this.Restaurante.id);
    } else {
      console.error('❌ Restaurante sem ID!', this.Restaurante);
    }
  }
  


  carregarLogo(id: number) {
    this.restauranteService.restauranteLogo(id).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('❌ Erro ao carregar logo:', erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.restauranteBanner(id).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('❌ Erro ao carregar banner:', erro),
    });
  }

  
}