import { EnderecoRequest } from './endereco-request';
import { CategoriaRestaurante } from '../CategoriaRestaurante';
import { DiasSemana } from '../DiaSemana';

export interface RestauranteRequest {
  // Dados de Usuario
  username: string;
  password: string;
  
  // Dados de Restaurante
  nmRestaurante: string;
  emailRestaurante: string;
  cnpj: string;
  telefoneRestaurante?: string;
  descricaoRestaurante?: string;
  
  // Endereços (obrigatório pelo menos 1)
  enderecos: EnderecoRequest[]; 
  
  // Categoria
  categoria?: CategoriaRestaurante | string | number;
  
  // Horários
  horarioAbertura?: string;
  horarioFechamento?: string;
  diasFuncionamento?: DiasSemana[] | string[];
  
  // Imagens (opcional no cadastro - pode ser adicionado depois)
  imagemLogo?: string;
  imagemBanner?: string;
  
  tempoMediaEntrega?: number;
}