import { Component } from '@angular/core';
import { PerfilRestaurante } from '../../components/perfil-restaurante/perfil-restaurante';

@Component({
  selector: 'app-login',
  imports: [PerfilRestaurante],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
