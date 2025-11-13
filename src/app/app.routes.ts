import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Cardapio } from './views/cardapio/cardapio';
import { NotFound } from './views/not-found/not-found';
import { Perfil } from './views/perfil/perfil';
import { Carrinho } from './views/carrinho/carrinho';
import { Login } from './views/login/login';
import { Cadastro } from './views/cadastro/cadastro';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cardapio/:id', component: Cardapio },
  { path: 'perfil', component: Perfil },
  { path: 'carrinho', component: Carrinho },
  { path: 'login', component: Login },
  {path: 'cadastro', component: Cadastro},
  { path: '**', component: NotFound },
];
