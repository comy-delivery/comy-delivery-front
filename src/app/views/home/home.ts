import { Component } from '@angular/core';
import { Categoria } from "../../components/categoria/categoria";

@Component({
  selector: 'app-home',
  imports: [Categoria],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
