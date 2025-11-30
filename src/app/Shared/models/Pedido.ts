import { Cliente } from './Cliente';
import { Restaurante } from './Restaurante';
import { Endereco } from './Endereco';
import { Cupom } from './Cupom';
import { ItemPedido } from './ItemPedido';
import { Entrega } from './Entrega';
import { Avaliacao } from './Avaliacao';
import { StatusPedido } from './StatusPedido';
import { FormaPagamento } from './FormaPagamento';

export interface Pedido {
  idPedido?: number;

  // Relacionamentos
  cliente: Cliente;
  restaurante: Restaurante;
  enderecoEntrega: Endereco;
  enderecoOrigem: Endereco;
  cupom?: Cupom;
  itensPedido: ItemPedido[];

  // Datas
  dtCriacao?: string;
  dtAtualizacao?: string;

  // Valores
  vlSubtotal: number;
  vlEntrega: number;
  vlDesconto: number;
  vlTotal: number;

  // Enums
  status: StatusPedido | string;
  formaPagamento: FormaPagamento | string;

  tempoEstimadoEntrega?: number;
  dsObservacoes?: string;

  // Controle de Aceitação
  isAceito: boolean;
  dtAceitacao?: string;
  motivoRecusa?: string;

  // Relacionamentos opcionais
  entrega?: Entrega;
  avaliacoes?: Avaliacao[];
}
