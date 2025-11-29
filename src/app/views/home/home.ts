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

  private todosRestaurantesData: any[] = [];

  private restauranteService = inject(RestauranteService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private searchService = inject(BuscaService);
  
  private estadoBusca: string = '';
  private estadoCategoria: string = 'Todos';
  private estadoFiltros: { preco: string, avaliacao: string } = { preco: 'todos', avaliacao: 'todos' };

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    const role = this.authService.getUserRole();

    this.searchService.search$.subscribe((texto) => {
      this.estadoBusca = texto;
      this.aplicarFiltros();
    });

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
    // Começa sempre com a lista completa original
    let lista = [...this.todosRestaurantesData];

    // 1. Filtro por Busca (Input da Navbar)
    if (this.estadoBusca) {
      const termo = this.estadoBusca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      lista = lista.filter(item => {
        const nome = (item.restaurante.nmRestaurante || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return nome.includes(termo);
      });
    }

    // 2. Filtro de Categoria
    if (this.estadoCategoria && this.estadoCategoria !== 'Todos') {
      const categoriaApi = this.mapearCategoriaParaApi(this.estadoCategoria);
      if (categoriaApi) {
        lista = lista.filter(item => item.restaurante.categoria === categoriaApi);
      }
    }

    // 3. Filtro por Avaliação (Radio Buttons)
    if (this.estadoFiltros.avaliacao !== 'todos') {
      const filtroNota = Number(this.estadoFiltros.avaliacao);
      
      lista = lista.filter(item => {
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
        this.todosRestaurantesData = response; // Guarda backup
        this.restaurantesData = response;      // Mostra inicial
        this.aplicarFiltros();                 // Aplica filtros se já houver algum selecionado
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
        // Normaliza estrutura para ficar igual à busca de próximos
        const data = response.map(r => ({
          restaurante: r,
          distanciaKm: null,
          mediaPrecoProdutos: null,
          valorFreteEstimado: null,
          tempoEstimadoEntrega: r.tempoMediaEntrega
        }));
        
        this.todosRestaurantesData = data;
        this.restaurantesData = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Erro ao buscar restaurantes:', err)
    });
  }
}