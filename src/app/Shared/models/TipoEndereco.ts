export enum TipoEndereco {
  CASA = 'CASA',
  TRABALHO = 'TRABALHO',
  OUTRO = 'OUTRO',
  MATRIZ = 'MATRIZ',
  FILIAL = 'FILIAL',
}

export const TipoEnderecoLabel: Record<TipoEndereco, string> = {
  [TipoEndereco.CASA]: 'Casa',
  [TipoEndereco.TRABALHO]: 'Trabalho',
  [TipoEndereco.OUTRO]: 'Outro',
  [TipoEndereco.MATRIZ]: 'Matriz',
  [TipoEndereco.FILIAL]: 'Filial',
};
