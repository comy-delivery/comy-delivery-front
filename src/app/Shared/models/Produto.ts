import { Restaurante } from './Restaurante';

export interface Produto {
  idProduto: number;
  nmProduto: string;
  dsProduto: string;
  vlPreco: number;
  restauranteId: number; 
  categoriaProduto: string;
  tempoPreparacao?: number;
  isPromocao: boolean;
  vlPrecoPromocional?: number;
  isAtivo: boolean;
  dataCadastro?: string;
  
  restaurante?: { id: number }; // Para o carrinho
  adicionais?: any[]; // Opcional - será buscado separadamente
}