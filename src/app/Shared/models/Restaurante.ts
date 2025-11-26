import { Usuario } from './Usuario';
import { Endereco } from './Endereco';
import { CategoriaRestaurante } from './CategoriaRestaurante';
import { DiasSemana } from './DiaSemana';
import { Produto } from './Produto';
import { Pedido } from './Pedido';

export interface Restaurante extends Usuario {
  nmRestaurante: string;
  emailRestaurante: string;
  cnpj: string;
  telefoneRestaurante?: string;

  imagemLogo?: string;
  imagemBanner?: string;

  descricaoRestaurante?: string;

  enderecos?: Endereco[];

  categoria?: CategoriaRestaurante;

  horarioAbertura?: string;
  horarioFechamento?: string;

  diasFuncionamento?: DiasSemana[];

  produtos?: Produto[];
  pedidos?: Pedido[];

  tempoMediaEntrega?: number;
  avaliacaoMediaRestaurante?: number;

  isAberto: boolean;
  isDisponivel: boolean; // boolean default false no Java

  dataCadastro: string;
}
