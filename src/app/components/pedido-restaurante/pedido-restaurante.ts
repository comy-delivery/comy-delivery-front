import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../Shared/models/Pedido';
import { PedidoService } from '../../services/pedido-service';
import { ProdutoService } from '../../services/produto-service';
import { ClienteService } from '../../services/cliente-service';

@Component({
  selector: 'app-pedido-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido-restaurante.html',
  styleUrl: './pedido-restaurante.scss'
})
export class PedidoRestauranteComponent implements OnInit {
  
  @Input() pedido!: Pedido;
  @Output() pedidoAtualizado = new EventEmitter<Pedido>();
  @Output() pedidoRemovido = new EventEmitter<number>();

  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private clienteService = inject(ClienteService);

  // Estados do pedido
  StatusPedido = {
    PENDENTE: 'PENDENTE',
    CONFIRMADO: 'CONFIRMADO',
    EM_PREPARO: 'EM_PREPARO',
    PRONTO: 'PRONTO',
    SAIU_PARA_ENTREGA: 'SAIU_PARA_ENTREGA',
    ENTREGUE: 'ENTREGUE',
    CANCELADO: 'CANCELADO'
  };

  // Controle de UI
  isProcessing = false;
  errorMessage = '';
  tempoEstimado = 30; // Tempo padrão em minutos
  motivoRecusa = '';
  mostrarModalRecusa = false;

  // Imagens dos itens (carregadas dinamicamente)
  imagensItens: Map<number, string> = new Map();

  // 🆕 ADICIONAR - Armazena nome do cliente
  nomeCliente: string = 'Carregando...';

  ngOnInit(): void {
    //this.carregarImagensItens();
    this.carregarDadosCliente(); // 🆕 ADICIONAR
  }

  // 🆕 ADICIONAR - Método para carregar dados do cliente
  carregarDadosCliente(): void {
    // Verifica se já tem o nome do cliente no objeto
    if (this.pedido.cliente && (this.pedido.cliente as any).nmCliente) {
      this.nomeCliente = (this.pedido.cliente as any).nmCliente;
      return;
    }

    // Busca o ID do cliente
    const clienteId = (this.pedido.cliente as any)?.id || (this.pedido as any).clienteId;
    
    if (clienteId) {
      this.clienteService.buscarClientePorId(clienteId).subscribe({
        next: (cliente) => {
          this.nomeCliente = cliente.nmCliente || cliente.usuario?.username || 'Cliente';
          console.log('✅ Nome do cliente carregado:', this.nomeCliente);
        },
        error: (err) => {
          console.error('❌ Erro ao buscar cliente:', err);
          this.nomeCliente = 'Cliente não encontrado';
        }
      });
    } else {
      this.nomeCliente = 'Cliente não informado';
    }
  }

  /**
   * Carrega as imagens dos produtos dos itens do pedido
   */
  carregarImagensItens(): void {
    if (!this.pedido.itensPedido) return;

    this.pedido.itensPedido.forEach(item => {
      const idProduto = this.getIdProdutoItem(item);
      if (idProduto) {
        this.produtoService.itemImagem(idProduto).subscribe({
          next: (blob) => {
            this.imagensItens.set(idProduto, URL.createObjectURL(blob));
          },
          error: (err) => console.error('Erro ao carregar imagem do produto:', err)
        });
      }
    });
  }

  /**
   * Retorna a imagem de um item
   */
  getImagemItem(idProduto: number): string {
    return this.imagensItens.get(idProduto) || 'assets/placeholder-product.png';
  }

  // ========== VERIFICAÇÕES DE STATUS ==========

  isPendente(): boolean {
    return this.pedido.status === this.StatusPedido.PENDENTE;
  }

  isConfirmado(): boolean {
    return this.pedido.status === this.StatusPedido.CONFIRMADO;
  }

  isEmPreparo(): boolean {
    return this.pedido.status === this.StatusPedido.EM_PREPARO;
  }

  isPronto(): boolean {
    return this.pedido.status === this.StatusPedido.PRONTO;
  }

  isSaiuParaEntrega(): boolean {
    return this.pedido.status === this.StatusPedido.SAIU_PARA_ENTREGA;
  }

  isEntregue(): boolean {
    return this.pedido.status === this.StatusPedido.ENTREGUE;
  }

  isCancelado(): boolean {
    return this.pedido.status === this.StatusPedido.CANCELADO;
  }

  /**
   * Retorna a classe CSS baseada no status
   */
  getStatusClass(): string {
    switch (this.pedido.status) {
      case this.StatusPedido.PENDENTE: return 'status-pendente';
      case this.StatusPedido.CONFIRMADO: return 'status-confirmado';
      case this.StatusPedido.EM_PREPARO: return 'status-em-preparo';
      case this.StatusPedido.PRONTO: return 'status-pronto';
      case this.StatusPedido.SAIU_PARA_ENTREGA: return 'status-saiu-entrega';
      case this.StatusPedido.ENTREGUE: return 'status-entregue';
      case this.StatusPedido.CANCELADO: return 'status-cancelado';
      default: return '';
    }
  }

  /**
   * Retorna o texto amigável do status
   */
  getStatusTexto(): string {
    switch (this.pedido.status) {
      case this.StatusPedido.PENDENTE: return 'Pendente';
      case this.StatusPedido.CONFIRMADO: return 'Confirmado';
      case this.StatusPedido.EM_PREPARO: return 'Em Preparo';
      case this.StatusPedido.PRONTO: return 'Pronto';
      case this.StatusPedido.SAIU_PARA_ENTREGA: return 'Saiu para Entrega';
      case this.StatusPedido.ENTREGUE: return 'Entregue';
      case this.StatusPedido.CANCELADO: return 'Cancelado';
      default: return this.pedido.status;
    }
  }

  // ========== AÇÕES DO PEDIDO ==========

  /**
   * ACEITAR PEDIDO: PENDENTE → CONFIRMADO
   */
  aceitarPedido(): void {
    if (!this.pedido.idPedido) return;

    this.isProcessing = true;
    this.errorMessage = '';

    console.log(`✅ Aceitando pedido #${this.pedido.idPedido} com tempo estimado: ${this.tempoEstimado} min`);

    this.pedidoService.aceitarPedido(this.pedido.idPedido!, this.tempoEstimado).subscribe({
      next: (pedidoAtualizado) => {
        console.log('✅ Pedido aceito com sucesso:', pedidoAtualizado);
        this.pedido = pedidoAtualizado;
        this.isProcessing = false;
        this.pedidoAtualizado.emit(pedidoAtualizado);
      },
      error: (err) => {
        console.error('❌ Erro ao aceitar pedido:', err);
        this.errorMessage = err.error?.message || 'Erro ao aceitar pedido';
        this.isProcessing = false;
      }
    });
  }

  /**
   * RECUSAR PEDIDO: PENDENTE → CANCELADO
   */
  abrirModalRecusa(): void {
    this.mostrarModalRecusa = true;
    this.motivoRecusa = '';
  }

  fecharModalRecusa(): void {
    this.mostrarModalRecusa = false;
    this.motivoRecusa = '';
  }

  confirmarRecusa(): void {
    if (!this.pedido.idPedido) return;
    if (!this.motivoRecusa.trim()) {
      this.errorMessage = 'Informe o motivo da recusa';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    console.log(`❌ Recusando pedido #${this.pedido.idPedido} - Motivo: ${this.motivoRecusa}`);

    this.pedidoService.recusarPedido(this.pedido.idPedido, this.motivoRecusa).subscribe({
      next: (pedidoAtualizado) => {
        console.log('✅ Pedido recusado com sucesso:', pedidoAtualizado);
        this.pedido = pedidoAtualizado;
        this.isProcessing = false;
        this.fecharModalRecusa();
        this.pedidoAtualizado.emit(pedidoAtualizado);
        
        // Remove da lista após 2 segundos
        setTimeout(() => {
          this.pedidoRemovido.emit(this.pedido.idPedido);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Erro ao recusar pedido:', err);
        this.errorMessage = err.error?.message || 'Erro ao recusar pedido';
        this.isProcessing = false;
      }
    });
  }

  /**
   * INICIAR PREPARO: CONFIRMADO → EM_PREPARO
   */
  iniciarPreparo(): void {
    this.atualizarStatus(this.StatusPedido.EM_PREPARO);
  }

  /**
   * MARCAR COMO PRONTO: EM_PREPARO → PRONTO
   */
  marcarComoPronto(): void {
    this.atualizarStatus(this.StatusPedido.PRONTO);
  }

  /**
   * Atualiza o status do pedido (genérico)
   */
  private atualizarStatus(novoStatus: string): void {
    if (!this.pedido.idPedido) return;

    this.isProcessing = true;
    this.errorMessage = '';

    console.log(`🔄 Atualizando pedido #${this.pedido.idPedido} para status: ${novoStatus}`);

    this.pedidoService.atualizarStatus(this.pedido.idPedido, novoStatus).subscribe({
      next: (pedidoAtualizado) => {
        console.log('✅ Status atualizado com sucesso:', pedidoAtualizado);
        this.pedido = pedidoAtualizado;
        this.isProcessing = false;
        this.pedidoAtualizado.emit(pedidoAtualizado);
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar status:', err);
        this.errorMessage = err.error?.message || 'Erro ao atualizar status do pedido';
        this.isProcessing = false;
      }
    });
  }

  // ========== FORMATAÇÕES E HELPERS ==========

  /**
   * Retorna o nome do cliente de forma segura
   * 🆕 MODIFICADO - Agora usa a variável nomeCliente
   */
  getNomeCliente(): string {
    return this.nomeCliente;
  }

  /**
   * Retorna o endereço formatado de forma segura
   */
  getEnderecoFormatado(): string {
    const end = this.pedido?.enderecoEntrega;
    if (!end) return 'Endereço não informado';
    
    // Campos do Endereco: logradouro, numero, complemento, bairro, cidade, cep, estado
    const logradouro = (end as any).logradouro || '';
    const numero = (end as any).numero || '';
    const bairro = (end as any).bairro || '';
    const cidade = (end as any).cidade || '';
    
    let endereco = `${logradouro}, ${numero}`;
    if (bairro) endereco += ` - ${bairro}`;
    if (cidade) endereco += `, ${cidade}`;
    
    return endereco.trim();
  }

  /**
   * Retorna a forma de pagamento formatada
   */
  getFormaPagamento(): string {
    return this.pedido?.formaPagamento || 'Não informado';
  }

  formatarHora(data?: string | Date): string {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  formatarData(data?: string | Date): string {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Retorna o nome do produto de um item
   * ItemPedido tem: produto.nmProduto
   */
  getNomeProduto(item: any): string {
    return item?.produto?.nmProduto || 'Produto';
  }

  /**
   * Retorna a quantidade de um item
   * ItemPedido tem: qtQuantidade
   */
  getQuantidadeItem(item: any): number {
    return item?.qtQuantidade || 0;
  }

  /**
   * Retorna o valor unitário de um item
   * ItemPedido tem: vlPrecoUnitario
   */
  getValorUnitarioItem(item: any): number {
    return item?.vlPrecoUnitario || 0;
  }

  /**
   * Retorna o ID do produto de um item
   * ItemPedido tem: produto.idProduto
   */
  getIdProdutoItem(item: any): number {
    return item?.produto?.idProduto || 0;
  }

  /**
   * Retorna a observação de um item
   */
  getObservacaoItem(item: any): string {
    return item?.dsObservacao || '';
  }
}