import { TipoEndereco } from './TipoEndereco';
import { Cliente } from './Cliente';
import { Restaurante } from './Restaurante';

export interface Endereco {
  idEndereco?: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  cep: string;
  estado?: string;
  tipoEndereco?: TipoEndereco;
  pontoDeReferencia?: string;
  isPadrao: boolean;
  latitude?: number;
  longitude?: number;

  // Relacionamentos

  cliente?: Cliente;
  restaurante?: Restaurante;
}
