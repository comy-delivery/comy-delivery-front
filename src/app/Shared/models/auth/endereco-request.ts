import { TipoEndereco } from '../TipoEndereco';

export interface EnderecoRequest {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  cep: string;
  estado?: string;
  tipoEndereco?: TipoEndereco | string;
  pontoDeReferencia?: string;
  isPadrao: boolean;
  latitude?: number;
  longitude?: number;
}