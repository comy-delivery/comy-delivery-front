import { Adicional } from './Adicional';

export interface ItemPedido {
  idItemPedido?: number;
  produto: {
    idProduto: number;
    nmProduto: string;
  };
  qtQuantidade: number;
  vlPrecoUnitario: number;
  vlSubtotal: number;
  dsObservacao?: string;
  adicionais?: Adicional[];
}