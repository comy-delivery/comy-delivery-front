import { Produto } from './Produto';

export interface Adicional {
  idAdicional: number;
  nmAdicional: string;
  dsAdicional?: string;
  vlPrecoAdicional: number;
  isDisponivel: boolean;

  produto?: Produto;
}
