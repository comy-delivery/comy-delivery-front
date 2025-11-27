export enum StatusPedido {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  EM_PREPARO = 'EM_PREPARO',
  PRONTO = 'PRONTO',
  SAIU_PARA_ENTREGA = 'SAIU_PARA_ENTREGA',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export const StatusPedidoLabel: Record<StatusPedido, string> = {
  [StatusPedido.PENDENTE]: 'Pendente',
  [StatusPedido.CONFIRMADO]: 'Confirmado',
  [StatusPedido.EM_PREPARO]: 'Em preparo',
  [StatusPedido.PRONTO]: 'Pronto',
  [StatusPedido.SAIU_PARA_ENTREGA]: 'Saiu para entrega',
  [StatusPedido.ENTREGUE]: 'Entregue',
  [StatusPedido.CANCELADO]: 'Cancelado',
};
