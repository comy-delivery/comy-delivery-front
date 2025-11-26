export enum DiasSemana {
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO',
}

export const DiasSemanaLabel: Record<DiasSemana, string> = {
  [DiasSemana.SEGUNDA]: 'Segunda-feira',
  [DiasSemana.TERCA]: 'Terça-feira',
  [DiasSemana.QUARTA]: 'Quarta-feira',
  [DiasSemana.QUINTA]: 'Quinta-feira',
  [DiasSemana.SEXTA]: 'Sexta-feira',
  [DiasSemana.SABADO]: 'Sábado',
  [DiasSemana.DOMINGO]: 'Domingo',
};
