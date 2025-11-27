export enum FormaPagamento {
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
  PIX = 'PIX',
  DINHEIRO = 'DINHEIRO',
}

export const FormaPagamentoLabel: Record<FormaPagamento, string> = {
  [FormaPagamento.CREDITO]: 'CRÉDITO',
  [FormaPagamento.DEBITO]: 'DÉBITO',
  [FormaPagamento.PIX]: 'PIX',
  [FormaPagamento.DINHEIRO]: 'DINHEIRO',
};
