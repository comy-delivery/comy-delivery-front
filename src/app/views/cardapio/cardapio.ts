import { Component, inject, Input, OnInit } from '@angular/core';
import { ItemCardapio } from '../../components/item-cardapio/item-cardapio';
import { Produto } from '../../Shared/models/Produto';
import { ProdutoService } from '../../services/produto-service';
import { Restaurante } from '../../Shared/models/Restaurante';
import { RestauranteService } from '../../services/restaurante-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente-service';
import { AuthService } from '../../services/auth-service';

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
export class Cardapio implements OnInit {
  private produtoService = inject(ProdutoService);
  private restauranteService = inject(RestauranteService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  idRestaurante!: number;
  protected cardapioAgrupado: CategoriaAgrupada[] = [];
  protected produtos: Produto[] = [];

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

    if (idUrl) {
      this.idRestaurante = Number(idUrl);

      // Carregar dados do restaurante
        this.restauranteService.buscarRestaurantePorId(this.idRestaurante).subscribe({
        next: (restaurante) => {
          this.Restaurante = restaurante;
          this.nota = restaurante.avaliacaoMediaRestaurante;
        },
        error: (erro) => console.error(erro),
      });

      // Carregar produtos do restaurante
      this.produtoService.buscarProdutos(this.idRestaurante).subscribe({
        next: (response) => {
          this.produtos = response;
          this.organizarCardapio();
        },
        error: (erro) => console.error(erro),
      });

      // 3. Carrega dados calculados (Distância, Frete, Tempo real)
      this.carregarDadosCalculados();

      // 4. Imagens
      this.carregarBanner(this.idRestaurante);
      this.carregarLogo(this.idRestaurante);

      
    
    }
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
        error: (err) => console.error('Erro ao buscar dados calculados:', err)
      });
    }
  }


  carregarLogo(id: number) {
    this.restauranteService.restauranteLogo(this.idRestaurante).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.restauranteBanner(this.idRestaurante).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error(erro),
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
  }
}
