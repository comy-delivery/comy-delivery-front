import { Usuario } from './Usuario'; // Certifique-se de ter este model
import { Entrega } from './Entrega';
import { VeiculoEntregador } from './VeiculoEntregador';

export interface Entregador extends Usuario {
  nmEntregador: string;
  emailEntregador: string;

  telefoneEntregador?: string;
  cpfEntregador: string;

  veiculo?: VeiculoEntregador | string; // Enum
  placa?: string;

  dataCadastroEntregador?: string;

  isDisponivel: boolean;

  avaliacaoMediaEntregador?: number;

  // Relacionamento OneToMany
  entregasEntregador?: Entrega[];
}
