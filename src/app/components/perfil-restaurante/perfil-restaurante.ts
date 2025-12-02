import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';
import { ProdutoRestaurante } from '../produto-restaurante/produto-restaurante';
import { Restaurante } from '../../Shared/models/Restaurante';
import { Pedido } from '../../Shared/models/Pedido';
import { ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante-service';
import { AuthService } from '../../services/auth-service';
import { DashboardRestaurante, PedidoService } from '../../services/pedido-service';
import { ProdutoService } from '../../services/produto-service';
import { environment } from '../../../environments/environment';
import { PedidosRestauranteComponent } from "../pedidos-restaurante/pedidos-restaurante";

@Component({
  selector: 'app-perfil-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, ProdutoRestaurante, PedidosRestauranteComponent, PedidosRestauranteComponent],
  templateUrl: './perfil-restaurante.html',
  styleUrls: ['./perfil-restaurante.scss'],
})
export class PerfilRestaurante implements OnInit, OnChanges {
  private restauranteService = inject(RestauranteService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private produtoService = inject(ProdutoService);

  @Input() Restaurante: Restaurante = {} as Restaurante;
  @Input() pedidosInput: Pedido[] = [];

  logoUrl: string | null = null;
  bannerUrl: string | null = null;

  produtos: any[] = [];
  pedidos: Pedido[] = [];
  dashboard: DashboardRestaurante | null = null;
  dashboardStats = {
    totalPedidosHistorico: 0,
    faturamentoDiario: 0,
    pedidosPendentes: 0,
    pedidosAceitos: 0
  };
  
  isLoading: boolean = true;
  errorMessage: string = '';
  isSaving: boolean = false;
  successMessage: string = '';
  
  tabAtiva: 'pedidos' | 'produtos' = 'pedidos';
  mostrarModal = false;
  produtoAtual: any = {};
  adicionaisTemporarios: any[] = [];

  restauranteId: number | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : this.authService.getUserId();

    if (id) {
      this.restauranteId = id;
      this.loadAllForRestaurante(id);
    } else if (this.Restaurante && this.Restaurante.id) {
      this.restauranteId = this.Restaurante.id;
      this.loadAllForRestaurante(this.Restaurante.id);
    } else {
      this.errorMessage = 'ID do restaurante não encontrado';
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Restaurante'] && this.Restaurante && this.Restaurante.id) {
      this.restauranteId = this.Restaurante.id;
      this.loadAllForRestaurante(this.Restaurante.id);
    }
  }

  private loadAllForRestaurante(id: number) {
    this.isLoading = true;
    
    this.restauranteService.buscarRestaurantePorId(id).subscribe({
      next: (rest) => {
        this.Restaurante = rest;
        console.log('PerfilRestaurante: restaurante carregado para id=', id, rest);
      },
      error: (err) => {
        console.error('Erro ao buscar restaurante:', err);
        this.errorMessage = 'Erro ao carregar dados do restaurante';
      },
    });

    this.restauranteService.listarProdutosRestaurante(id).subscribe({
      next: (prods) => {
        this.produtos = prods;
        console.log('PerfilRestaurante: produtos carregados para id=', id, prods && prods.length);
      },
      error: (err) => console.error('Erro ao listar produtos:', err),
    });

    this.pedidoService.listarPorRestaurante(id).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.calcularDashboardStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao listar pedidos:', err);
        this.isLoading = false;
      }
    });

    this.pedidoService.obterDashboard(id).subscribe({
      next: (dashboard: any) => {
        console.log('📊 Dashboard recebido:', dashboard);
        
        // O backend retorna um array, pega o primeiro item (hoje)
        if (Array.isArray(dashboard) && dashboard.length > 0) {
          this.dashboard = dashboard[0];
          this.dashboardStats.faturamentoDiario = dashboard[0].faturamentoTotal || 0;
        }
      },
      error: (err) => {
        console.error('❌ Erro ao carregar dashboard:', err);
        console.error('❌ URL chamada:', `${environment.apiUrl}/pedido/restaurante/${id}/dashboard`);
      }
    });

    this.carregarLogo(id);
    this.carregarBanner(id);
  }

  carregarLogo(id: number) {
    this.restauranteService.buscarLogo(id).subscribe({
      next: (blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('Erro ao carregar logo:', erro),
    });
  }

  carregarBanner(id: number) {
    this.restauranteService.buscarBanner(id).subscribe({
      next: (blob) => {
        this.bannerUrl = URL.createObjectURL(blob);
      },
      error: (erro) => console.error('Erro ao carregar banner:', erro),
    });
  }

  ativarTab(tab: 'pedidos' | 'produtos') {
    this.tabAtiva = tab;
  }

  abrirModalAdicionar() {
    this.produtoAtual = {
      disponivel: true // Define como disponível por padrão
    };
    this.adicionaisTemporarios = [];
    this.mostrarModal = true;
  }

  getCountByStatus(status: string): number {
    return this.pedidos ? this.pedidos.filter((p) => p.status === status).length : 0;
  }

  getCountByStatuses(statuses: string[]): number {
    return this.pedidos ? this.pedidos.filter((p) => statuses.includes(p.status)).length : 0;
  }

  getReceitaHoje(): string {
    if (!this.pedidos || this.pedidos.length === 0) return '0.00';
    const hoje = new Date().toISOString().slice(0, 10);
    const soma = this.pedidos
      .filter((p) => p.dtCriacao?.startsWith(hoje) && p.status === 'ENTREGUE')
      .reduce((acc, p) => acc + (Number((p as any).vlTotal) || 0), 0);
    return soma.toFixed(2);
  }

  // ========== CRUD PRODUTOS ==========

  confirmRemover(prodId: number) {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      this.removerProduto(prodId);
    }
  }

  fecharModal() {
    this.mostrarModal = false;
    this.produtoAtual = {};
    this.adicionaisTemporarios = [];
  }

  /**
   * Método para capturar imagem selecionada
   */
  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.produtoAtual.imagemFile = file;
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.produtoAtual.imagemPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Salvar produto (apenas criar novo)
   */
  salvarProduto() {
    const restauranteId = this.restauranteId;

    if (!restauranteId) {
      console.error('Restaurante não definido para salvar produto');
      this.errorMessage = 'Erro: Restaurante não identificado';
      return;
    }

    // Validação básica
    if (!this.produtoAtual.nome || !this.produtoAtual.preco) {
      this.errorMessage = 'Preencha pelo menos o nome e o preço do produto';
      return;
    }

    // Validar categoria (obrigatória no backend)
    if (!this.produtoAtual.categoria || this.produtoAtual.categoria.trim() === '') {
      this.errorMessage = 'A categoria do produto é obrigatória';
      return;
    }

    // VALIDAR IMAGEM (obrigatória ao criar)
    if (!this.produtoAtual.imagemFile) {
      this.errorMessage = 'A imagem do produto é obrigatória';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Preparar o objeto do produto com TODOS os campos obrigatórios
    const produtoParaEnviar = {
      nmProduto: this.produtoAtual.nome,
      descricao: this.produtoAtual.descricao || '',
      vlPreco: Number(this.produtoAtual.preco),
      categoriaProduto: this.produtoAtual.categoria || 'Sem categoria', // Backend exige categoria
      disponivel: this.produtoAtual.disponivel !== undefined ? this.produtoAtual.disponivel : true,
      restauranteId: restauranteId // Backend espera 'restauranteId', não 'idRestaurante'
    };

    console.log('📤 Enviando produto:', produtoParaEnviar);
    console.log('📤 Com imagem:', this.produtoAtual.imagemFile);

    // CRIAR NOVO PRODUTO
    this.restauranteService.criarProduto(
      produtoParaEnviar, 
      this.produtoAtual.imagemFile
    ).subscribe({
      next: (created) => {
        console.log('✅ Produto criado:', created);
        this.produtos.push(created);
        this.successMessage = 'Produto criado com sucesso!';
        this.isSaving = false;
        this.fecharModal();
        this.clearMessages();
        
        // Recarrega a lista de produtos para garantir sincronização
        if (this.restauranteId) {
          this.restauranteService.listarProdutosRestaurante(this.restauranteId).subscribe({
            next: (prods) => {
              this.produtos = prods;
            }
          });
        }
      },
      error: (err) => {
        console.error('❌ Erro ao criar produto:', err);
        console.error('❌ Detalhes:', err.error);
        this.errorMessage = `Erro ao criar produto: ${err.error?.detail || err.error?.message || err.message}`;
        this.isSaving = false;
      }
    });
  }

  adicionarNovoAdicionalAoProduto() {
    this.adicionaisTemporarios.push({ nome: '', preco: 0, descricao: '' });
  }

  removerAdicionalTemporario(index: number) {
    this.adicionaisTemporarios.splice(index, 1);
  }

  // ❌ REMOVIDO: método editarProduto()

  /**
   * Remover produto
   */
  removerProduto(produtoId: number) {
    if (!this.restauranteId) {
      console.error('Restaurante não definido para remover produto');
      this.errorMessage = 'Erro: Restaurante não identificado';
      return;
    }
    
    if (!produtoId) {
      console.error('Produto inválido para remoção');
      return;
    }

    console.log('🗑️ Iniciando remoção do produto ID:', produtoId);
    console.log('🗑️ URL que será chamada:', `${environment.apiUrl}/produto/${produtoId}`);

    this.restauranteService.deletarProduto(produtoId).subscribe({
      next: () => {
        console.log('✅ Produto removido do backend com sucesso, ID:', produtoId);
        // Filtra usando idProduto (não 'id')
        this.produtos = this.produtos.filter((p) => p.idProduto !== produtoId);
        console.log('📦 Produtos restantes:', this.produtos.length);
        this.successMessage = 'Produto removido com sucesso!';
        this.clearMessages();
      },
      error: (err) => {
        console.error('❌ Erro ao remover produto do backend:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Mensagem:', err.error);
        this.errorMessage = `Erro ao remover produto: ${err.error?.message || err.message}`;
      }
    });
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  /**
   * Calcula estatísticas do dashboard baseado nos pedidos carregados
   */
  private calcularDashboardStats(): void {
    if (!this.pedidos || this.pedidos.length === 0) {
      return;
    }

    // Total de pedidos (histórico completo)
    this.dashboardStats.totalPedidosHistorico = this.pedidos.length;

    // Pedidos pendentes e aceitos
    this.dashboardStats.pedidosPendentes = this.pedidos.filter(p => p.status === 'PENDENTE').length;
    this.dashboardStats.pedidosAceitos = this.pedidos.filter(p => p.status === 'ACEITO').length;

    console.log('📊 Dashboard Stats calculados:', this.dashboardStats);
  }
}