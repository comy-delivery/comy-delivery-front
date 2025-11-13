import { Component } from '@angular/core';
import { PainelEntregador } from '../painel-entregador/painel-entregador';
import { EntregaDisponivel } from '../entrega-disponivel/entrega-disponivel';

@Component({
  selector: 'app-perfil-entregador',
  imports: [PainelEntregador, EntregaDisponivel],
  templateUrl: './perfil-entregador.html',
  styleUrl: './perfil-entregador.scss',
})
export class PerfilEntregador {}
