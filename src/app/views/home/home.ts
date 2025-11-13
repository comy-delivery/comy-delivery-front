import { Component } from '@angular/core';
import { Categoria } from "../../components/categoria/categoria";
import { CardRestaurante } from "../../components/card-restaurante/card-restaurante";

@Component({
  selector: 'app-home',
  imports: [Categoria, CardRestaurante],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
