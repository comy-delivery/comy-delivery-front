import { Component } from '@angular/core';
import { PerfilRestaurante } from '../../components/perfil-restaurante/perfil-restaurante';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [PerfilRestaurante, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
