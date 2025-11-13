import { Component } from '@angular/core';
import { PerfilEntregador } from '../../components/perfil-entregador/perfil-entregador';

@Component({
  selector: 'app-perfil',
  imports: [PerfilEntregador],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {}
