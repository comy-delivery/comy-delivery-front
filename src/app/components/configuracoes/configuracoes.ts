import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  imports: [],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes {
  protected botaoEditar: boolean = true;


  clickEditar() {
    this.botaoEditar = !this.botaoEditar;
  }

  clickSalvar() {
    this.botaoEditar = !this.botaoEditar;
  }
}
