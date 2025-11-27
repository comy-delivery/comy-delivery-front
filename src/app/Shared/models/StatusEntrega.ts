export enum StatusEntrega {
  PENDENTE = 'PENDENTE',
  EM_ROTA = 'EM_ROTA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

export const StatusEntregaLabel: Record<StatusEntrega, string> = {
  [StatusEntrega.PENDENTE]: 'Pendente',
  [StatusEntrega.EM_ROTA]: 'Em rota',
  [StatusEntrega.CONCLUIDA]: 'Concluída',
  [StatusEntrega.CANCELADA]: 'Cancelada',
};
