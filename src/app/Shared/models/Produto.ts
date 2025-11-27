import { Restaurante } from './Restaurante';
import { Adicional } from './Adicional'; 

export interface Produto {
  idProduto: number;
  nmProduto: string;
  dsProduto: string;
  vlPreco: number;
  imagemProduto?: string; // byte[] no Java vira string Base64 no JSON

  restaurante?: Restaurante; // Relacionamento

  categoriaProduto: string;
  tempoPreparacao?: number;
  isPromocao: boolean;
  vlPrecoPromocional?: number;
  isAtivo: boolean;
  dataCadastroProduto?: string;
   adicionais?: Adicional[];
}
