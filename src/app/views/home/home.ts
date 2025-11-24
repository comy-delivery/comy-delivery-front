import { Component } from '@angular/core';
import { Categoria } from '../../components/categoria/categoria';
import { CardRestaurante } from '../../components/card-restaurante/card-restaurante';
import { Footer } from '../../components/footer/footer';
import { Banner } from '../../components/banner/banner';
import { Filtros } from "../../components/filtros/filtros";

@Component({
  selector: 'app-home',
  imports: [Categoria, CardRestaurante, Footer, Banner, Filtros],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
