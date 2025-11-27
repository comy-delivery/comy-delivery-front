import { Produto } from './Produto';
import { Adicional } from './Adicional';
import { Pedido } from './Pedido';

export interface ItemPedido {
  idItemPedido?: number;
  pedido?: Pedido;
  produto: Produto;
  qtQuantidade: number;
  vlPrecoUnitario: number;
  vlSubtotal: number;
  dsObservacao?: string;
  adicionais: Adicional[];
}
