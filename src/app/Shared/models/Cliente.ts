import { Usuario } from './Usuario';
import { Pedido } from './Pedido';
import { Endereco } from './Endereco';

export interface Cliente extends Usuario {
  nmCliente: string;
  emailCliente: string;
  cpfCliente: string;
  telefoneCliente: string;

  dataCadastroCliente?: string;

  // Relacionamentos

  pedidos?: Pedido[];
  enderecos?: Endereco[];
}
