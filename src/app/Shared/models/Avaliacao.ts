import { Restaurante } from './Restaurante';
import { Cliente } from './Cliente';
import { Pedido } from './Pedido';
import { Entregador } from './Entregador';

export interface Avaliacao {
  idAvaliacao?: number;

  restaurante: Restaurante;
  cliente: Cliente;
  pedido: Pedido;
  entregador: Entregador;

  nuNota: number;
  dsComentario?: string;

  dtAvaliacao?: string;

  // Nota específica do entregador
  avaliacaoEntrega?: number;
}
