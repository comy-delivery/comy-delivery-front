import { RoleUsuario } from './RoleUsuario';

export interface Usuario {
  id: number;
  username: string;

  password?: string;

  roleUsuario: RoleUsuario;

  recuperar: boolean;
  isAtivo: boolean;

  tokenRecuperacaoSenha?: string;
  expiracaoToken?: string;
}
