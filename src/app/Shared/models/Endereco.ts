export interface Endereco {
  idEndereco?: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  cep: string;
  estado?: string;
  tipoEndereco?: string;
  pontoDeReferencia?: string;
  isPadrao?: boolean;
  latitude?: number;
  longitude?: number;
}