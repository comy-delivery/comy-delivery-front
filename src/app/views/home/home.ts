import { Component } from '@angular/core';
import { Categoria } from "../../components/categoria/categoria";
import { CardRestaurante } from "../../components/card-restaurante/card-restaurante";
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-home',
  imports: [Categoria, CardRestaurante, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
