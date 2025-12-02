import { Component } from '@angular/core';
import { PerfilRestaurante } from '../../components/perfil-restaurante/perfil-restaurante';
import { CommonModule } from '@angular/common';
import { PerfilEntregador } from '../../components/perfil-entregador/perfil-entregador';
import { PerfilCliente } from '../../components/perfil-cliente/perfil-cliente';
import { HomeRestauranteComponent } from '../../components/home-restaurante/home-restaurante';

@Component({
  selector: 'app-perfil',
  imports: [
    HomeRestauranteComponent,
    CommonModule,
    PerfilEntregador,
    PerfilCliente,
    PerfilRestaurante,
  ],

  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  public logado: string = 'Cliente';
}
