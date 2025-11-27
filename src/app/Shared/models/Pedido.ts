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
  idPedido?: number; // Opcional na criação

  // Relacionamentos
  cliente: Cliente;
  restaurante: Restaurante;
  enderecoEntrega: Endereco;
  enderecoOrigem: Endereco;
  cupom?: Cupom; // Pode ser nulo
  itensPedido: ItemPedido[];

  // Datas (LocalDateTime vira string no JSON)
  dtCriacao?: string;
  dtAtualizacao?: string;

  // Valores (BigDecimal vira number)
  vlSubtotal: number;
  vlEntrega: number;
  vlDesconto: number;
  vlTotal: number;

  // Enums
  status: StatusPedido | string; // string permite flexibilidade caso o enum mude
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
