import { Component } from '@angular/core';
import { PerfilRestaurante } from '../../components/perfil-restaurante/perfil-restaurante';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [PerfilRestaurante, CommonModule],

  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {}
