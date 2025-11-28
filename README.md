# 🍕 Comy Delivery - Frontend

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.3.6-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple?style=for-the-badge&logo=bootstrap)
![Node](https://img.shields.io/badge/Node-20+-green?style=for-the-badge&logo=node.js)

Aplicação web moderna de delivery desenvolvida com Angular, oferecendo interface intuitiva para clientes, restaurantes e entregadores.

[Sobre](#-sobre-o-projeto) • [Tecnologias](#-tecnologias-utilizadas) • [Instalação](#️-instalação-e-configuração) • [Como Rodar](#️-como-rodar-o-projeto) • [Funcionalidades](#-funcionalidades) • [Equipe](#-equipe-de-desenvolvimento)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#️-instalação-e-configuração)
- [Como Rodar o Projeto](#️-como-rodar-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Services e API](#-services-e-api)
- [Autenticação](#-autenticação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Build para Produção](#-build-para-produção)
- [Troubleshooting](#-troubleshooting)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)

---

## 🎯 Sobre o Projeto

O **Comy Delivery Frontend** é uma aplicação web SPA (Single Page Application) desenvolvida em Angular que oferece:

- 🎨 Interface moderna e responsiva com Bootstrap 5
- 🔐 Sistema completo de autenticação com JWT
- 🛒 Carrinho de compras com persistência local
- 📱 Design mobile-first totalmente responsivo
- 🚀 Navegação rápida e fluida entre páginas
- 🎭 Múltiplos perfis de usuário (Cliente, Restaurante, Entregador, Admin)

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Angular** | 20.3.6 | Framework principal |
| **TypeScript** | 5.x | Linguagem de programação |
| **Bootstrap** | 5.3.8 | Framework CSS |
| **Bootstrap Icons** | 1.11.3 | Biblioteca de ícones |
| **RxJS** | - | Programação reativa |
| **Angular Router** | - | Roteamento SPA |
| **Angular HttpClient** | - | Comunicação HTTP |
| **Node.js** | 20+ | Runtime JavaScript |
| **npm** | 10+ | Gerenciador de pacotes |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- 🟢 **Node.js 20+** → [Download](https://nodejs.org/)
- 📦 **npm 10+** (vem com o Node.js)
- 🔧 **Angular CLI 20+** (instalado globalmente)
- 🔥 **Git** → [Download](https://git-scm.com/)
- 💻 **IDE** recomendada: VS Code

### Verificar Versões Instaladas

```bash
node --version      # Deve ser 20.x ou superior
npm --version       # Deve ser 10.x ou superior
ng version          # Deve ser 20.x
```

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/comy-delivery-front.git
cd comy-delivery-front
```

### 2️⃣ Instale o Angular CLI (se ainda não tiver)

```bash
npm install -g @angular/cli@20
```

### 3️⃣ Instale as Dependências

```bash
npm install
```

### 4️⃣ Configure as Variáveis de Ambiente

Edite o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8084/api',  // URL do backend
  tokenKey: 'comy_access_token',
  refreshTokenKey: 'comy_refresh_token'
};
```

---

## ▶️ Como Rodar o Projeto

### Desenvolvimento

```bash
ng serve
```

A aplicação estará disponível em: **`http://localhost:4200`**

### Desenvolvimento com Porta Customizada

```bash
ng serve --port 3000
```

### Desenvolvimento com Reload Automático

```bash
ng serve --open
```

O navegador abrirá automaticamente em `http://localhost:4200`

---

## 🌐 Acessando a Aplicação

Após iniciar o servidor:

| Recurso | URL |
|---------|-----|
| **Home** | `http://localhost:4200` |
| **Login** | `http://localhost:4200/login` |
| **Cadastro** | `http://localhost:4200/cadastro` |
| **Cardápio** | `http://localhost:4200/cardapio/:id` |
| **Carrinho** | `http://localhost:4200/carrinho` |
| **Perfil** | `http://localhost:4200/perfil` |

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── banner/
│   │   ├── card-restaurante/
│   │   ├── item-cardapio/
│   │   ├── item-carrinho/
│   │   └── ...
│   │
│   ├── views/               # Páginas principais
│   │   ├── home/
│   │   ├── login/
│   │   ├── cadastro/
│   │   ├── cardapio/
│   │   ├── carrinho/
│   │   ├── perfil/
│   │   └── ...
│   │
│   ├── services/            # Serviços de API
│   │   ├── auth-service.ts
│   │   ├── restaurante-service.ts
│   │   ├── produto-service.ts
│   │   ├── carrinho-service.ts
│   │   └── ...
│   │
│   ├── guards/              # Guards de rota
│   │   └── auth-guard.ts
│   │
│   ├── interceptors/        # HTTP Interceptors
│   │   └── auth-interceptor.ts
│   │
│   ├── Shared/              # Modelos e tipos
│   │   └── models/
│   │       ├── Cliente.ts
│   │       ├── Restaurante.ts
│   │       ├── Produto.ts
│   │       ├── Pedido.ts
│   │       └── ...
│   │
│   ├── app.routes.ts        # Configuração de rotas
│   ├── app.config.ts        # Configuração global
│   └── app.ts               # Componente raiz
│
├── environments/            # Variáveis de ambiente
│   ├── environment.ts       # Desenvolvimento
│   └── environment.prod.ts  # Produção
│
├── assets/                  # Arquivos estáticos
├── styles.scss              # Estilos globais
└── index.html               # HTML principal
```

---

## 🎯 Funcionalidades

### 👤 Para Clientes

- ✅ Cadastro e login de usuário
- ✅ Busca de restaurantes disponíveis
- ✅ Filtros por categoria e avaliação
- ✅ Visualização de cardápio completo
- ✅ Adição de produtos ao carrinho
- ✅ Seleção de adicionais
- ✅ Aplicação de cupons de desconto
- ✅ Gestão de endereços de entrega
- ✅ Histórico de pedidos
- ✅ Avaliação de pedidos

### 🍕 Para Restaurantes

- ✅ Painel administrativo completo
- ✅ Gestão de produtos e cardápio
- ✅ Adição de adicionais aos produtos
- ✅ Controle de horários de funcionamento
- ✅ Gerenciamento de pedidos
- ✅ Atualização de status dos pedidos
- ✅ Upload de logo e banner
- ✅ Visualização de métricas

### 🚴 Para Entregadores

- ✅ Painel de entregas disponíveis
- ✅ Visualização de detalhes da entrega
- ✅ Atualização de status
- ✅ Dashboard de performance
- ✅ Histórico de entregas

### 🔧 Funcionalidades Gerais

- ✅ Autenticação com JWT
- ✅ Refresh automático de token
- ✅ Carrinho persistente (LocalStorage)
- ✅ Modo escuro/claro (toggle de tema)
- ✅ Design responsivo
- ✅ Notificações e alerts
- ✅ Recuperação de senha

---

## 🗺️ Rotas da Aplicação

### Rotas Públicas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Home | Página inicial com lista de restaurantes |
| `/login` | Login | Autenticação de usuários |
| `/cadastro` | Cadastro | Registro de novos usuários |
| `/esqueceu` | RecuperarSenha | Recuperação de senha |
| `/cardapio/:id` | Cardapio | Cardápio do restaurante |

### Rotas Protegidas (Requer Autenticação)

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/perfil` | Perfil | Perfil do usuário logado |
| `/carrinho` | Carrinho | Carrinho de compras |
| `/entrega` | Entrega | Painel do entregador |

### Proteção de Rotas

```typescript
// Exemplo de uso dos guards
{
  path: 'carrinho',
  component: Carrinho,
  canActivate: [authGuard]  // Bloqueia se não estiver logado
}
```

---

## 🔌 Services e API

### Principais Services

#### AuthService
```typescript
// Autenticação
login(credentials: LoginRequest): Observable<LoginResponse>
logout(): void
refreshToken(): Observable<RefreshTokenResponse>
isLoggedIn(): boolean
```

#### RestauranteService
```typescript
// Restaurantes
buscarRestaurantes(): Observable<Restaurante[]>
buscarRestaurantePorId(id: number): Observable<Restaurante>
listarProdutosRestaurante(id: number): Observable<Produto[]>
buscarLogo(id: number): Observable<Blob>
buscarBanner(id: number): Observable<Blob>
```

#### ProdutoService
```typescript
// Produtos
buscarProdutos(restauranteId: number): Observable<Produto[]>
itemImagem(id: number): Observable<Blob>
```

#### CarrinhoService
```typescript
// Carrinho (com LocalStorage)
adicionar(item: ItemPedido): void
remover(index: number): void
limpar(): void
itensCarrinho$: Observable<ItemPedido[]>
```

---

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Token)** com os seguintes componentes:

### Token Storage
```typescript
// LocalStorage Keys
comy_access_token      // Token de acesso (curta duração)
comy_refresh_token     // Token de renovação (longa duração)
```

### Auth Interceptor

Adiciona automaticamente o token Bearer em todas as requisições:

```typescript
Authorization: Bearer <access_token>
```

### Auto-Refresh

O sistema renova o token automaticamente quando expira (erro 401).

### Roles Disponíveis

- `CLIENTE` - Acesso de cliente
- `RESTAURANTE` - Acesso de restaurante
- `ENTREGADOR` - Acesso de entregador
- `ADMIN` - Acesso administrativo

---

## 🔧 Variáveis de Ambiente

### Development (`environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8084/api',
  tokenKey: 'comy_access_token',
  refreshTokenKey: 'comy_refresh_token'
};
```

### Production (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://sua-api-producao.com/api',
  tokenKey: 'comy_access_token',
  refreshTokenKey: 'comy_refresh_token'
};
```

---

## 📦 Build para Produção

### Gerar Build de Produção

```bash
ng build --configuration=production
```

O build será gerado em: `dist/comy-delivery-front/`

### Visualizar Build Local

```bash
# Instalar servidor HTTP
npm install -g http-server

# Servir a aplicação
cd dist/comy-delivery-front/browser
http-server
```

Acesse: `http://localhost:8080`

### Otimizações Aplicadas

- ✅ Minificação de código
- ✅ Tree-shaking (remoção de código não usado)
- ✅ AOT Compilation
- ✅ Lazy loading de módulos
- ✅ Compressão de assets

---

## 🐛 Troubleshooting

### ❌ Erro: "ng: command not found"

**Solução:** Instale o Angular CLI globalmente

```bash
npm install -g @angular/cli@20
```

### ❌ Erro: "Module not found"

**Solução:** Reinstale as dependências

```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Erro: "Port 4200 is already in use"

**Solução:** Use outra porta

```bash
ng serve --port 4201
```

Ou mate o processo na porta 4200:

```bash
# Linux/Mac
lsof -ti:4200 | xargs kill -9

# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### ❌ Erro: "Cannot connect to API"

**Solução:** 
1. Verifique se o backend está rodando em `http://localhost:8084`
2. Confirme a URL em `environment.ts`
3. Verifique configurações de CORS no backend

### ❌ Erro: "Token expired"

**Solução:** Faça logout e login novamente. O sistema deve renovar automaticamente.

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Inicia servidor de desenvolvimento
ng serve                     # Alternativa ao npm start
ng serve --open              # Inicia e abre navegador

# Build
npm run build                # Build de produção
ng build                     # Build padrão
ng build --watch             # Build com watch mode

# Testes
npm test                     # Roda testes unitários
ng test                      # Alternativa
ng test --watch=false        # Roda testes uma vez

# Linting
ng lint                      # Verifica erros de código

# Informações
ng version                   # Versão do Angular e dependências
ng analytics                 # Configurar analytics
```

---

## 🎨 Personalização de Tema

### Toggle Dark/Light Mode

O usuário pode alternar entre modo claro e escuro clicando no botão na navbar.

```typescript
// navbar.ts
toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}
```

O tema é persistido no LocalStorage.

---

## 📱 Responsividade

O projeto usa **Bootstrap 5** com sistema de grid responsivo:

- 📱 **Mobile**: `col-12, col-sm-*`
- 📱 **Tablet**: `col-md-*`
- 💻 **Desktop**: `col-lg-*, col-xl-*`

Todos os componentes são testados em:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

---

## 🔒 Segurança

- 🔐 Tokens JWT armazenados com segurança
- 🛡️ Guards de rota para proteção
- 🚫 Sanitização de entradas de usuário
- 🔄 Refresh automático de tokens
- 🚪 Logout em caso de falha de autenticação

---

## 📊 Performance

Otimizações implementadas:

- ⚡ Lazy loading de imagens
- 🚀 OnPush Change Detection
- 📦 Compressão de assets
- 🗜️ Minificação de código
- 🎯 Tree-shaking
- 💾 Cache de requisições

---



## 👥 Equipe de Desenvolvimento

<table>
  <tr>
    <td align="center">
      <b>Arthur</b>
    </td>
    <td align="center">
      <b>Emilio</b>
    </td>
    <td align="center">
      <b>Heloisa</b>
    </td>
    <td align="center">
      <b>Jude</b>
    </td>
    <td align="center">
      <b>Sinara</b>
    </td>
  </tr>
</table>



---

## 📄 Licença

Este projeto é de propriedade da equipe **Comy Delivery**.

---

## 🔗 Links Úteis

- 📚 [Documentação Angular](https://angular.dev)
- 🎨 [Bootstrap 5](https://getbootstrap.com)
- 🔧 [Angular CLI](https://angular.dev/tools/cli)
- 📖 [TypeScript](https://www.typescriptlang.org)

---

<div align="center">

⭐ **Desenvolvido com Angular e ❤️**

[⬆ Voltar ao topo](#-comy-delivery---frontend)

</div>
