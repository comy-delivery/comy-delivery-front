export enum VeiculoEntregador {
  MOTO = 'MOTO',
  BICICLETA = 'BICICLETA',
  CARRO = 'CARRO',
}

export const VeiculoEntregadorLabel: Record<VeiculoEntregador, string> = {
  [VeiculoEntregador.MOTO]: 'Moto',
  [VeiculoEntregador.BICICLETA]: 'Bicicleta',
  [VeiculoEntregador.CARRO]: 'Carro',
};
