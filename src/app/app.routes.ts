import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Cardapio } from './views/cardapio/cardapio';
import { NotFound } from './views/not-found/not-found';
import { Perfil } from './views/perfil/perfil';
import { Carrinho } from './views/carrinho/carrinho';
import { Login } from './views/login/login';
import { Cadastro } from './views/cadastro/cadastro';
import { Entrega } from './views/entrega/entrega';
import { RecuperarSenha } from './views/recuperar-senha/recuperar-senha';
import { authGuard, publicGuard } from './guards/auth-guard';

export const routes: Routes = [
  //rotas publics
  { 
    path: '', 
    component: Home 
  },
  { 
    path: 'cardapio/:id', 
    component: Cardapio 
  },
  { 
    path: 'cardapio', 
    component: Cardapio 
  },
  
  //rotas de autenticacao (acessa se nao estiver logado)
  { 
    path: 'login', 
    component: Login,
    canActivate: [publicGuard] //Se logado, redireciona para home
  },
  { 
    path: 'cadastro', 
    component: Cadastro,
    canActivate: [publicGuard]
  },
  { 
    path: 'esqueceu', 
    component: RecuperarSenha,
    canActivate: [publicGuard]
  },

  // rotas protegidas (acessa se tiver logado)
  { 
    path: 'perfil', 
    component: Perfil,
    canActivate: [authGuard] //bloqueia se nao estiver logado
  },
  { 
    path: 'carrinho', 
    component: Carrinho,
    canActivate: [authGuard]
  },
  { 
    path: 'entrega', 
    component: Entrega,
    canActivate: [authGuard]
  },

  //rota de erro
  { 
    path: '**', 
    component: NotFound 
  },
];