import { Component, inject, OnInit } from '@angular/core';
import { Categoria } from '../../components/categoria/categoria';
import { CardRestaurante } from '../../components/card-restaurante/card-restaurante';

import { Banner } from '../../components/banner/banner';
import { Filtros } from '../../components/filtros/filtros';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';
import { PerfilRestaurante } from '../../components/perfil-restaurante/perfil-restaurante';

@Component({
  selector: 'app-home',
  imports: [Categoria, CardRestaurante, Banner, Filtros, PerfilRestaurante],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected tipo = 'Cliente';

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
