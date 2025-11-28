import { VeiculoEntregador } from '../VeiculoEntregador';

export interface EntregadorRequest {
  // Dados de Usuario
  username: string;
  password: string;
  
  // Dados de Entregador
  nmEntregador: string;
  emailEntregador: string;
  cpfEntregador: string;
  telefoneEntregador?: string;
  veiculo?: VeiculoEntregador | string;
  placa?: string;
}