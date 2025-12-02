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
import { Entregador } from './views/entregador/entregador';
import { PainelAdmin } from './views/painel-admin/painel-admin';
import { authGuard, publicGuard, roleGuard } from './guards/auth-guard';
import { OAuth2Callback } from './components/oauth2-callback/oauth2-callback';
import { HomeRestauranteComponent } from './components/home-restaurante/home-restaurante';
import { PainelEntregador } from './components/painel-entregador/painel-entregador';
import { PerfilEntregador } from './components/perfil-entregador/perfil-entregador';
import { PerfilRestaurante } from './components/perfil-restaurante/perfil-restaurante';
import { ListagemRestaurantesComponent } from './components/listagem-restaurantes/listagem-restaurantes';
import { EntregasEntregadorComponent } from './views/entregas-entregador/entregas-entregador';
import { PedidosRestauranteComponent } from './components/pedidos-restaurante/pedidos-restaurante';

export const routes: Routes = [
  // ========== ROTAS PÚBLICAS ==========
  {
    path: '',
    component: Home,
  },
  {
    path: 'cardapio/:id',
    component: Cardapio,
  },
  {
    path: 'cardapio',
    component: Cardapio,
  },

  // ========== AUTENTICAÇÃO ==========
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard],
  },
  {
    path: 'oauth2/callback',
    component: OAuth2Callback,
  },
  {
    path: 'cadastro',
    component: Cadastro,
    canActivate: [publicGuard],
  },
  {
    path: 'recuperar-senha',
    component: RecuperarSenha,
    canActivate: [publicGuard],
  },

  // ========== CLIENTE ==========
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENTE'] },
  },
  {
    path: 'carrinho',
    component: Carrinho,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENTE'] },
  },

  // ========== RESTAURANTE ==========
  {
    path: 'restaurante',
    component: HomeRestauranteComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RESTAURANTE'] },
  },
  
  {
    path: 'restaurante/pedidos',
    component: PedidosRestauranteComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RESTAURANTE'] },
  },

  {
    path: 'restaurante-perfil',
    component: PerfilRestaurante,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RESTAURANTE'] },
  },

  // ========== ENTREGADOR ==========
  {
    path: 'entregador',
    component: PerfilEntregador,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ENTREGADOR'] },
  },
  {
    path: 'entrega',
    component: Entrega,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ENTREGADOR'] },
  },
  {
    path: 'entregador/entregas',
    component: EntregasEntregadorComponent,
    canActivate: [authGuard]
  },

  // ========== ADMIN ==========
  {
    path: 'admin',
    component: PainelAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/restaurantes',
    component: ListagemRestaurantesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },

  // ========== ERRO ==========
  {
    path: '**',
    component: NotFound,
  },
];