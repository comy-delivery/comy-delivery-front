import { Component } from '@angular/core';

@Component({
  selector: 'app-endereco-cliente',
  imports: [],
  templateUrl: './endereco-cliente.html',
  styleUrl: './endereco-cliente.scss',
})
export class EnderecoCliente {
  protected botaoEditar: boolean = true;

  clickEditar() {
    this.botaoEditar = !this.botaoEditar;
  }

  clickSalvar() {
    this.botaoEditar = !this.botaoEditar;
  }
}
