import { EnderecoRequest } from './endereco-request';

export interface ClienteRequest {
  // Dados de Usuario
  username: string;
  password: string;
  
  // Dados de Cliente
  nmCliente: string;
  emailCliente: string;
  cpfCliente: string;
  telefoneCliente: string;
  
  // Endereços (obrigatório pelo menos 1)
  enderecos: EnderecoRequest[];
}