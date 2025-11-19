import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosCliente } from '../pedidos-cliente/pedidos-cliente';


@Component({
  selector: 'app-perfil-cliente',
  imports: [FormsModule, PedidosCliente],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.scss',
})
export class PerfilCliente {
  protected opcao: String = 'pedidos';

}
