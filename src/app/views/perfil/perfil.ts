import { Component } from '@angular/core';
import { PerfilRestaurante } from '../../components/perfil-restaurante/perfil-restaurante';
import { CommonModule } from '@angular/common';
import { PerfilEntregador } from '../../components/perfil-entregador/perfil-entregador';
import { PerfilCliente } from '../../components/perfil-cliente/perfil-cliente';

@Component({
  selector: 'app-perfil',
  imports: [PerfilRestaurante, CommonModule, PerfilEntregador, PerfilCliente],

  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  public logado: string = 'Cliente';
}
