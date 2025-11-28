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

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [Categoria, CardRestaurante, Banner, Filtros, PerfilRestaurante, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected tipo = 'Cliente';

  // Lista que aceita o objeto composto (Restaurante + Dados calculados)
  protected restaurantesData: any[] = [];

  private restauranteService = inject(RestauranteService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private searchService = inject(BuscaService);

  private todosRestaurantes: Restaurante[] = [];
  protected restaurantesFiltrados: Restaurante[] = [];
  
  private estadoBusca: string = '';
  private estadoCategoria: string = 'Todos';
  private estadoFiltros: { preco: string, avaliacao: string } = { preco: 'todos', avaliacao: 'todos' };

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    const role = this.authService.getUserRole();

    if (role === 'RESTAURANTE') {
      this.tipo = 'Restaurante';
    } else if (userId && role === 'CLIENTE') {
      // Se for cliente logado, busca com distâncias e preços calculados
      this.tipo = 'Cliente';
      this.carregarRestaurantesProximos(userId);
    } else {
      // Fallback para visitante (sem ID)
      this.tipo = 'Cliente';
      this.carregarRestaurantesPadrao();
    }

    try {
      this.restauranteService.buscarRestaurantes().subscribe((response) => {
        this.todosRestaurantes = response;
        this.restaurantesFiltrados = response;
      });

      this.searchService.search$.subscribe((texto) => {
        this.estadoBusca = texto;
        this.aplicarFiltros();
      });

    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
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

  // Função auxiliar para mapear o nome da tela para o ENUM da API
  private mapearCategoriaParaApi(nomeInterface: string): string | null {
    switch (nomeInterface) {
      case 'Lanches': return 'LANCHE';
      case 'Pizzaria': return 'PIZZA';
      case 'Doces': return 'DOCE';
      case 'Asiática': return 'ASIATICA';
      case 'Brasileira': return 'BRASILEIRA';
      case 'Saudável': return 'SAUDAVEL';
      default: return null;
    }
  }

  private aplicarFiltros() {
    let lista = [...this.todosRestaurantes];

    // 1. Filtro por Busca (Input da Navbar)
    if (this.estadoBusca) {
      const termo = this.estadoBusca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      lista = lista.filter(r => {
        const nome = (r.nmRestaurante || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return nome.includes(termo);
      });
    }

    // 2. Filtro por Categoria (Abas)
    if (this.estadoCategoria && this.estadoCategoria !== 'Todos') {
      const categoriaApi = this.mapearCategoriaParaApi(this.estadoCategoria);
      
      if (categoriaApi) {
        lista = lista.filter(r => r.categoria === categoriaApi);
      }
    }

    // 3. Filtro por Avaliação (Radio Buttons)
    if (this.estadoFiltros.avaliacao !== 'todos') {
      const notaMinima = Number(this.estadoFiltros.avaliacao);
      // Se não tiver avaliação, considera 0
      lista = lista.filter(r => (r.avaliacaoMediaRestaurante || 0) >= notaMinima);
    }

    // 4. Ordenação por Preço (Placeholder para lógica futura)
    if (this.estadoFiltros.preco === 'maior_preco') {
      // lista.sort(...) 
    } else if (this.estadoFiltros.preco === 'menor_preco') {
      // lista.sort(...)
    }

    this.restaurantesFiltrados = lista;
  }

  private carregarRestaurantesProximos(id: number) {
    this.clienteService.listarRestaurantesProximos(id).subscribe({
      next: (response) => {
        this.restaurantesData = response;
      },
      error: (err) => {
        console.error('Erro ao buscar restaurantes próximos:', err);
        this.carregarRestaurantesPadrao();
      }
    });
  }

  private carregarRestaurantesPadrao() {
    this.restauranteService.buscarRestaurantes().subscribe({
      next: (response) => {
        // Adapta para a estrutura esperada pelo template
        this.restaurantesData = response.map(r => ({
          restaurante: r,
          distanciaKm: null,
          mediaPrecoProdutos: null,
          valorFreteEstimado: null,
          tempoEstimadoEntrega: r.tempoMediaEntrega
        }));
      },
      error: (err) => console.error('Erro ao buscar restaurantes:', err)
    });
  }
}
