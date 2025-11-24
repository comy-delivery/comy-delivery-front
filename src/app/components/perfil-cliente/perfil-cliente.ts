import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosCliente } from '../pedidos-cliente/pedidos-cliente';
import { EnderecoCliente } from "../endereco-cliente/endereco-cliente";
import { Configuracoes } from "../configuracoes/configuracoes";


@Component({
  selector: 'app-perfil-cliente',
  imports: [FormsModule, PedidosCliente, EnderecoCliente, Configuracoes],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.scss',
})
export class PerfilCliente {
  protected opcao: String = 'pedido';

}
