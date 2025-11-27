import { Restaurante } from './Restaurante';
import { TipoCupom } from './TipoCupom';

export interface Cupom {
  idCupom?: number; // Opcional na criação

  codigoCupom: string;
  dsCupom?: string; // Descrição opcional

  tipoCupom: TipoCupom | string; // Enum

  // Valores (BigDecimal vira number)
  vlDesconto?: number;
  percentualDesconto?: number;
  vlMinimoPedido?: number;

  // Datas (LocalDateTime vira string)
  dtValidade: string;
  dataCriacao?: string;

  // Contadores
  qtdUsoMaximo: number;
  qtdUsado: number;

  isAtivo: boolean;

  // Relacionamento
  restaurante?: Restaurante;
}
