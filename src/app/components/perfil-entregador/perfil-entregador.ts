import { Component } from '@angular/core';
import { EntregaDisponivel } from '../entrega-disponivel/entrega-disponivel';
import { PainelEntregador } from '../painel-entregador/painel-entregador';

@Component({
  selector: 'app-perfil-entregador',
  imports: [EntregaDisponivel, PainelEntregador],
  templateUrl: './perfil-entregador.html',
  styleUrl: './perfil-entregador.scss',
})
export class PerfilEntregador {}
