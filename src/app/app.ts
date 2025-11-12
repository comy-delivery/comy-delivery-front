import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Categoria } from "./components/categoria/categoria";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Categoria],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('comy-delivery-front');
}
