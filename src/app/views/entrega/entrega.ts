import { Component } from '@angular/core';
import { PainelEntregador } from '../../components/painel-entregador/painel-entregador';

@Component({
  selector: 'app-entrega',
  imports: [PainelEntregador],
  templateUrl: './entrega.html',
  styleUrl: './entrega.scss',
})
export class Entrega {}
