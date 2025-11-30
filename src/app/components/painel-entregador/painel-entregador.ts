import { Component } from '@angular/core';
import { Entrega } from '../../views/entrega/entrega';
import { EntregaDisponivel } from '../entrega-disponivel/entrega-disponivel';

@Component({
  selector: 'app-painel-entregador',
  imports: [Entrega, EntregaDisponivel],
  templateUrl: './painel-entregador.html',
  styleUrl: './painel-entregador.scss',
})
export class PainelEntregador {}
