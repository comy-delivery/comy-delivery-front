interface Cliente {
  id: number;
  nome: string;
}

interface Restaurante {
  id: number;
  nome: string;
 
}

interface Endereco {
  id: number;
  rua: string;

}

interface Cupom {
  id: number;
  codigo: string;  
}

interface ItemPedido {
  id: number;
 
}

interface Entrega {
    id: number;

}

interface Avaliacao {
    id: number;

}

type StatusPedido = 'PENDENTE' | 'CONFIRMADO' | 'EM_PREPARACAO' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO' | 'RECUSADO';
type FormaPagamento = 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'DINHEIRO';

export interface Pedido {
  idPedido: number; 
  cliente: Cliente;
  restaurante: Restaurante;
  enderecoEntrega: Endereco;
  enderecoOrigem: Endereco;
  cupom?: Cupom; 
  entrega?: Entrega; 
  itensPedido: ItemPedido[];
  avaliacoes: Avaliacao[];
  dtCriacao: string;
  dtAtualizacao?: string;
  vlSubtotal: number;
  vlEntrega: number;
  vlDesconto: number;
  vlTotal: number;
  status: StatusPedido;
  formaPagamento: FormaPagamento;
  tempoEstimadoEntrega?: number; 
  dsObservacoes?: string; 
  isAceito: boolean; 
  dtAceitacao?: string; 
  motivoRecusa?: string; 
}