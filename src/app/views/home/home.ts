import { Component, inject, OnInit } from '@angular/core';
import { Categoria } from '../../components/categoria/categoria';
import { CardRestaurante } from '../../components/card-restaurante/card-restaurante';
import { Banner } from '../../components/banner/banner';
import { Filtros } from '../../components/filtros/filtros';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';
import { PerfilRestaurante } from '../../components/perfil-restaurante/perfil-restaurante';
import { BuscaService } from '../../services/busca-service';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente-service';
import { AuthService } from '../../services/auth-service';
import { PainelEntregador } from '../../components/painel-entregador/painel-entregador';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Categoria,
    CardRestaurante,
    Banner,
    Filtros,
    PerfilRestaurante,
    CommonModule,
    PainelEntregador,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected tipo = 'Restaurante';

  // manter userId/role como propriedades para recarregar quando necessário
  private userId: number | null = null;
  private userRole: string | null = null;

  // Lista que aceita o objeto composto (Restaurante + Dados calculados)
  protected restaurantesData: any[] = [];

  private todosRestaurantesData: any[] = [];

  private restauranteService = inject(RestauranteService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private searchService = inject(BuscaService);

  private estadoBusca: string = '';
  private estadoCategoria: string = 'Todos';
  private estadoFiltros: { preco: string; avaliacao: string } = {
    preco: 'todos',
    avaliacao: 'todos',
  };

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getUserRole();

    this.searchService.search$.subscribe((texto) => {
      this.estadoBusca = texto;
      this.aplicarFiltros();
    });

    if (this.userRole === 'RESTAURANTE') {
      this.tipo = 'Restaurante';
    } else if (this.userId && this.userRole === 'CLIENTE') {
      // Se for cliente logado, busca com distâncias e preços calculados
      this.tipo = 'Cliente';
      this.carregarRestaurantesProximos(this.userId);
    } else if (this.userRole === 'ENTREGADOR') {
      this.tipo = 'Entregador';
    } else {
      // Fallback para visitante (sem ID)
      this.tipo = 'Cliente';
      this.carregarRestaurantesPadrao();
    }

    // Inscrever para alterações na lista de restaurantes (quando PainelAdmin notificar)
    try {
      this.restauranteService.restaurantesChanged$?.subscribe(() => {
        console.log('Notificação: restaurantes alterados — recarregando lista');
        if (this.userRole === 'CLIENTE' && this.userId) {
          this.carregarRestaurantesProximos(this.userId);
        } else {
          this.carregarRestaurantesPadrao();
        }
      });
    } catch (e) {
      console.warn('Erro ao inscrever restaurantesChanged$', e);
    }
  }

  // Método auxiliar para garantir que o ID exista e corrigir "undefined"
  private corrigirIdRestaurante(data: any[]): any[] {
    return data.map((item: any) => {
      // Se o item for o objeto wrapper que contém "restaurante"
      if (item.restaurante) {
        // Garante que restaurante.id exista
        if (!item.restaurante.id) {
          // Tenta mapear de outros campos comuns que o backend pode enviar
          item.restaurante.id =
            item.restaurante.idRestaurante ||
            item.restaurante.idUsuario ||
            item.restaurante.id_restaurante;
        }
      }
      // Se o item for diretamente o restaurante (caso do carregarRestaurantesPadrao às vezes)
      else {
        if (!item.id) {
          item.id = item.idRestaurante || item.idUsuario || item.id_restaurante;
        }
      }
      return item;
    });
  }

  // Handler chamado quando um CardRestaurante emite que foi deletado
  onRestauranteDeleted(id: number) {
    try {
      const getId = (item: any) => (item && item.restaurante ? item.restaurante.id : item.id);

      this.todosRestaurantesData = this.todosRestaurantesData.filter((r) => getId(r) !== id);
      this.restaurantesData = this.restaurantesData.filter((r) => getId(r) !== id);
      this.aplicarFiltros();
    } catch (e) {
      console.warn('Erro ao remover restaurante localmente', e);
    }
  }

  aoMudarCategoria(novaCategoria: string) {
    this.estadoCategoria = novaCategoria;
    this.aplicarFiltros();
  }

  aoMudarFiltros(filtros: any) {
    this.estadoFiltros = filtros;
    this.aplicarFiltros();
  }

  private mapearCategoriaParaApi(nomeInterface: string): string | null {
    switch (nomeInterface) {
      case 'Lanches':
        return 'LANCHE';
      case 'Pizzaria':
        return 'PIZZA';
      case 'Doces':
        return 'DOCE';
      case 'Asiática':
        return 'ASIATICA';
      case 'Brasileira':
        return 'BRASILEIRA';
      case 'Saudável':
        return 'SAUDAVEL';
      default:
        return null;
    }
  }

  private aplicarFiltros() {
    // Começa sempre com a lista completa original
    let lista = [...this.todosRestaurantesData];

    // 1. Filtro por Busca (Input da Navbar)
    if (this.estadoBusca) {
      const termo = this.estadoBusca
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      lista = lista.filter((item) => {
        const nome = (item.restaurante.nmRestaurante || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return nome.includes(termo);
      });
    }

    // 2. Filtro de Categoria
    if (this.estadoCategoria && this.estadoCategoria !== 'Todos') {
      const categoriaApi = this.mapearCategoriaParaApi(this.estadoCategoria);
      if (categoriaApi) {
        lista = lista.filter((item) => item.restaurante.categoria === categoriaApi);
      }
    }

    // 3. Filtro por Avaliação (Radio Buttons)
    if (this.estadoFiltros.avaliacao !== 'todos') {
      const filtroNota = Number(this.estadoFiltros.avaliacao);

      lista = lista.filter((item) => {
        const nota = item.restaurante.avaliacaoMediaRestaurante || 0;

        if (filtroNota === 5) {
          // Traga os de 5
          return nota >= 5;
        } else if (filtroNota === 4.5) {
          // Traga entre 4.9 e 4.5
          return nota >= 4.5 && nota < 5;
        } else if (filtroNota === 4) {
          // Traga 4.4 a 4.0
          return nota >= 4.0 && nota < 4.5;
        }

        return false;
      });
    }

    if (this.estadoFiltros.preco === 'maior') {
      lista.sort((a, b) => (b.mediaPrecoProdutos || 0) - (a.mediaPrecoProdutos || 0));
    } else if (this.estadoFiltros.preco === 'menor') {
      lista.sort((a, b) => (a.mediaPrecoProdutos || 0) - (b.mediaPrecoProdutos || 0));
    }

    this.restaurantesData = lista;
  }

private carregarRestaurantesProximos(id: number) {
    this.clienteService.listarRestaurantesProximos(id).subscribe({
      next: (response) => {
        console.log('📦 Response do backend:', response);
        
        // CORRIGIDO: O backend já retorna a estrutura correta:
        // { restaurante: {...}, distanciaKm: ..., mediaPrecoProdutos: ..., etc }
        // Não precisa normalizar nada!
        this.todosRestaurantesData = response;
        this.restaurantesData = response;
        
        console.log('🏪 Primeiro restaurante:', response[0]?.restaurante);
        console.log('🏪 ID do primeiro:', response[0]?.restaurante?.id);
        
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('❌ Erro ao buscar restaurantes próximos:', err);
        this.carregarRestaurantesPadrao();
      },
    });
  }
  private carregarRestaurantesPadrao() {
    this.restauranteService.buscarRestaurantes().subscribe({
      next: (response) => {
        // Normaliza estrutura para ficar igual à busca de próximos
        let data = response.map((r) => ({
          restaurante: r,
          distanciaKm: null,
          mediaPrecoProdutos: null,
          valorFreteEstimado: null,
          tempoEstimadoEntrega: r.tempoMediaEntrega,
        }));

        // Aplica a correção de IDs para evitar "undefined"
        data = this.corrigirIdRestaurante(data);

        this.todosRestaurantesData = data;
        this.restaurantesData = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Erro ao buscar restaurantes:', err),
    });
  }
}