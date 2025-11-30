import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ItemCardapio } from '../../components/item-cardapio/item-cardapio';
import { Produto } from '../../Shared/models/Produto';
import { ProdutoService } from '../../services/produto-service';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente-service';
import { AuthService } from '../../services/auth-service';
import { BuscaService } from '../../services/busca-service';
import { Subscription } from 'rxjs';

interface CategoriaAgrupada {
  nome: string;
  items: Produto[];
}

@Component({
  selector: 'app-cardapio',
  imports: [ItemCardapio, CommonModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.scss',
})
export class Cardapio implements OnInit, OnDestroy {
  private produtoService = inject(ProdutoService);
  private restauranteService = inject(RestauranteService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private searchService = inject(BuscaService);
  private route = inject(ActivatedRoute);

  idRestaurante!: number;
  protected cardapioAgrupado: CategoriaAgrupada[] = [];

  protected produtos: Produto[] = [];

  private todosProdutos: Produto[] = [];

  private termoBusca: string = '';
  private searchSubscription?: Subscription;

  @Input({ required: true }) Restaurante = {} as Restaurante;
  @Input() id!: string;

  distancia: number | null = null;
  tempoEstimado: number | null = null;
  valorFrete: number | null = null;
  nota: number | null = null;

  logoUrl: string | null = null;
  bannerUrl: string | null = null;


  ngOnInit(): void {
    const idUrl = this.route.snapshot.paramMap.get('id');
    
    console.log('🔍 DEBUG - idUrl:', idUrl);
    console.log('🔍 DEBUG - idRestaurante antes:', this.idRestaurante);

    // CORRIGIDO: Subscribe ANTES de usar
    this.searchSubscription = this.searchService.search$.subscribe((termo) => {
      this.termoBusca = termo;
      // Só filtra se JÁ tiver produtos carregados
      if (this.todosProdutos && this.todosProdutos.length > 0) {
        this.filtrarProdutos(termo);
      }
    });

    if (idUrl) {
      this.idRestaurante = Number(idUrl);
      console.log('✅ ID do restaurante definido:', this.idRestaurante);

      // 1. Carregar dados do restaurante
      this.restauranteService.buscarRestaurantePorId(this.idRestaurante).subscribe({
        next: (restaurante) => {
          this.Restaurante = restaurante;
          this.nota = restaurante.avaliacaoMediaRestaurante;
        },
        error: (erro) => console.error('❌ Erro ao carregar restaurante:', erro),
      });

      // 2. Carregar produtos do restaurante
      this.produtoService.listarPorRestaurante(this.idRestaurante).subscribe({
        next: (response) => {
          console.log('✅ Produtos recebidos do backend:', response);
          
          this.todosProdutos = response.map(prod => {
            // Garante que o produto tenha o restaurante setado (para o carrinho)
            if (!prod.restaurante) {
              prod.restaurante = { id: this.idRestaurante } as any; 
            }
            return prod;
          });

          console.log('📦 Total de produtos carregados:', this.todosProdutos.length);
          
          // AGORA SIM filtra e organiza o cardápio
          this.filtrarProdutos(this.termoBusca);    
        },
        error: (erro) => {
          console.error('❌ Erro ao carregar produtos:', erro);
        },
      });

      // 3. Carrega dados calculados (Distância, Frete, Tempo real)
      this.carregarDadosCalculados();

      // 4. Imagens
      this.carregarBanner(this.idRestaurante);
      this.carregarLogo(this.idRestaurante);
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  filtrarProdutos(termo: string) {
    // CORRIGIDO: Verifica primeiro se tem produtos
    if (!this.todosProdutos || this.todosProdutos.length === 0) {
      console.log('⚠️ Nenhum produto para filtrar ainda');
      return;
    }

    if (!termo || termo.trim() === '') {
      // Sem termo de busca = mostra todos
      this.produtos = [...this.todosProdutos];
      console.log('📋 Mostrando todos os produtos:', this.produtos.length);
    } else {
      // Com termo de busca = filtra
      const t = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      
      this.produtos = this.todosProdutos.filter(p => {
        const nome = (p.nmProduto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const desc = (p.dsProduto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        
        return nome.includes(t) || desc.includes(t);
      });
      
      console.log(`🔍 Produtos filtrados por "${termo}":`, this.produtos.length);
    }
    
    // Reorganiza a visualização com os produtos filtrados
    this.organizarCardapio();
  }



  carregarDadosCalculados() {
    const userId = this.authService.getUserId();
    
    // Só busca se tiver um usuário logado
    if (userId) {
      this.clienteService.listarRestaurantesProximos(userId).subscribe({
        next: (lista) => {
          // Encontra o restaurante atual na lista de próximos para pegar os dados calculados
          const dadosCalculados = lista.find(item => item.restaurante.id === this.idRestaurante);
          
          if (dadosCalculados) {
            this.distancia = dadosCalculados.distanciaKm;
            this.tempoEstimado = dadosCalculados.tempoEstimadoEntrega;
            this.valorFrete = dadosCalculados.valorFreteEstimado;
            // Atualiza nota se disponível
            if (dadosCalculados.restaurante.avaliacaoMediaRestaurante) {
                this.nota = dadosCalculados.restaurante.avaliacaoMediaRestaurante;
            }
          }
        },
        error: (err) => console.error('⚠️ Erro ao buscar dados calculados:', err)
      });
    }
  }


  carregarLogo(id: number) {
    this.restauranteService.restauranteLogo(this.idRestaurante).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('⚠️ Erro ao carregar logo:', erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.restauranteBanner(this.idRestaurante).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('⚠️ Erro ao carregar banner:', erro),
    });
  }

  private organizarCardapio() {
    const grupos: { [key: string]: Produto[] } = {};

    this.produtos.forEach((produto) => {
      const categoria = produto.categoriaProduto || 'Outros';

      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(produto);
    });

    this.cardapioAgrupado = Object.keys(grupos).map((nome) => ({
      nome,
      items: grupos[nome],
    }));
    
    console.log('📋 Cardápio organizado:', this.cardapioAgrupado.length, 'categorias');
  }
}