import { Pedido } from './Pedido';
import { Entregador } from './Entregador'; // Verifique se já criou este model
import { Endereco } from './Endereco';
import { StatusEntrega } from './StatusEntrega'; // Importe o Enum criado anteriormente

export interface Entrega {
  idEntrega?: number;

  pedido: Pedido;
  entregador?: Entregador;

  statusEntrega: StatusEntrega | string;

  enderecoOrigem: Endereco;
  enderecoDestino: Endereco;

  dataHoraInicio?: string;
  dataHoraConclusao?: string;

  tempoEstimadoMinutos?: number;

  vlEntrega?: number;
  avaliacaoCliente?: number;
}
