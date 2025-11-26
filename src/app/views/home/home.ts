import { Component, inject, OnInit } from '@angular/core';
import { Categoria } from '../../components/categoria/categoria';
import { CardRestaurante } from '../../components/card-restaurante/card-restaurante';

import { Banner } from '../../components/banner/banner';
import { Filtros } from '../../components/filtros/filtros';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';

@Component({
  selector: 'app-home',
  imports: [Categoria, CardRestaurante, Banner, Filtros],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private restauranteService = inject(RestauranteService);

  ngOnInit(): void {
    try {
      this.restauranteService
        .buscarRestaurantes()
        .subscribe((response) => (this.restaurantes = response));
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
    }
  }
  protected restaurantes: Restaurante[] = [];
}
