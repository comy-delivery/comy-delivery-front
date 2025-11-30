import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, Subscription } from 'rxjs';

import { ItemCardapio } from '../../components/item-cardapio/item-cardapio';
import { ItemCarrinho } from '../../components/item-carrinho/item-carrinho';
import { ItemPedido } from '../../Shared/models/ItemPedido';
import { CarrinhoService } from '../../services/carrinho-service';
import { PedidoService } from '../../services/pedido-service';
import { AuthService } from '../../services/auth-service';
import { ClienteService } from '../../services/cliente-service';
import { CupomService } from '../../services/cupom-service';
import { RestauranteService } from '../../services/restaurante-service';


@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, ItemCarrinho, RouterLink, FormsModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho implements OnInit, OnDestroy {
  private carrinhoService = inject(CarrinhoService);
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private restauranteService = inject(RestauranteService);
  private authService = inject(AuthService);
  private cupomService = inject(CupomService);
  
  
  private router = inject(Router);

  // Variável para gerenciar a inscrição na memória
  private subscription!: Subscription;

  itemsCarrinho: ItemPedido[] = [];
  taxaEntrega: number = 0;

  codigoCupom: string = '';
  valorDesconto: number = 0;
  cupomAplicado: boolean = false;
  msgCupom: string = '';
  erroCupom: boolean = false;
  validandoCupom: boolean = false;
  idCupomAplicado: number | null = null;


  isFinalizando: boolean = false;

  ngOnInit(): void {
    this.subscription = this.carrinhoService.itensCarrinho$.subscribe((itens) => {
      this.itemsCarrinho = itens;
      this.calcularFrete();

      
      // Se mudar os itens, remove o cupom para evitar inconsistências
      if (this.cupomAplicado) {
        this.removerCupom();
        this.msgCupom = 'Cupom removido devido à alteração no carrinho. Aplique novamente.';
        this.erroCupom = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  calcularFrete() {
    // Se o carrinho estiver vazio, zera o frete
    if (this.itemsCarrinho.length === 0) {
      this.taxaEntrega = 0;
      return;
    }

    const userId = this.authService.getUserId();
    // CORRIGIDO: Cast para any para acessar restaurante
    const restauranteId = (this.itemsCarrinho[0].produto as any).restaurante?.id;

    if (userId && restauranteId) {
      this.clienteService.listarRestaurantesProximos(userId).subscribe({
        next: (lista) => {
          const dadosRestaurante = lista.find(item => item.restaurante.id === restauranteId);
          
          if (dadosRestaurante) {
            this.taxaEntrega = dadosRestaurante.valorFreteEstimado;
          }
        },
        error: (err) => console.error('Erro ao buscar taxa de entrega:', err)
      });
    }
  }

  aplicarCupom() {
    this.msgCupom = '';
    this.erroCupom = false;

    const codigoLimpo = this.codigoCupom.trim();

    if (!codigoLimpo) {
      this.msgCupom = 'Digite um código de cupom.';
      this.erroCupom = true;
      return;
    }

    const valorPedido = this.subtotal;

    if (valorPedido <= 0) {
      this.msgCupom = 'Adicione itens ao carrinho antes de aplicar cupom.';
      this.erroCupom = true;
      return;
    }

    this.validandoCupom = true;

    this.cupomService.validarCupom(this.codigoCupom, valorPedido).subscribe({
      next: (isValid) => {
        if (isValid) {
          // 2. Buscar ID do Cupom
          this.buscarIdECalcularDesconto(this.codigoCupom, valorPedido);
        } else {
          this.validandoCupom = false;
          this.erroCupom = true;
          this.msgCupom = 'Cupom inválido ou regras não atendidas.';
          this.valorDesconto = 0;
          this.idCupomAplicado = null;
        }
      },
      error: (err) => {
        this.validandoCupom = false;
        console.error('Erro na requisição validar:', err);
        this.erroCupom = true;
        this.msgCupom = 'Erro ao conectar com servidor de cupons.';
      }
    });
  }

  private buscarIdECalcularDesconto(codigo: string, valorPedido: number) {
    this.cupomService.buscarCupomPorCodigo(codigo).subscribe({
      next: (cupom) => {
        if (cupom && cupom.idCupom) {
          // 3. Calcular Desconto
          this.idCupomAplicado = cupom.idCupom;
          this.calcularValorDoDesconto(cupom.idCupom, valorPedido);
        } else {
          this.validandoCupom = false;
          this.erroCupom = true;
          this.msgCupom = 'Cupom não encontrado.';
        }
      },
      error: (err) => {
        this.validandoCupom = false;
        console.error(err);
        this.erroCupom = true;
        this.msgCupom = 'Erro ao recuperar dados do cupom.';
      }
    });
  }

  private calcularValorDoDesconto(idCupom: number, valorPedido: number) {
    this.cupomService.calcularDesconto(idCupom, valorPedido).subscribe({
      next: (desconto) => {
        this.validandoCupom = false;
        this.valorDesconto = desconto;
        this.cupomAplicado = true;
        this.erroCupom = false;
        this.msgCupom = `Cupom aplicado! Desconto de R$ ${desconto.toFixed(2)}`;
        console.log('💰 Desconto aplicado:', desconto);
      },
      error: (err) => {
        this.validandoCupom = false;
        console.error(err);
        this.erroCupom = true;
        this.msgCupom = 'Erro ao calcular o valor do desconto.';
      }
    });
  }

  removerCupom() {
    this.codigoCupom = '';
    this.valorDesconto = 0;
    this.cupomAplicado = false;
    this.idCupomAplicado = null;
    this.msgCupom = '';
    this.erroCupom = false;
  }

  async finalizarPedido() {
    if (this.itemsCarrinho.length === 0) return;
    
    this.isFinalizando = true;
    const userId = this.authService.getUserId();
    // CORRIGIDO: Cast para any para acessar restaurante
    const restauranteId = (this.itemsCarrinho[0].produto as any).restaurante?.id;

    if (!userId || !restauranteId) {
      alert('Erro ao identificar usuário ou restaurante.');
      this.isFinalizando = false;
      return;
    }

    try {
      // 1. Buscar endereço do Cliente (Entrega)
      const cliente = await firstValueFrom(this.clienteService.buscarClientePorId(userId));
      // Pega o padrão ou o primeiro da lista
      const enderecoEntrega = cliente.enderecos.find((e: any) => e.isPadrao) || cliente.enderecos[0];

      // 2. Buscar endereço do Restaurante (Origem)
      const restaurante = await firstValueFrom(this.restauranteService.buscarRestaurantePorId(restauranteId));
      const enderecoOrigem = restaurante.enderecos && restaurante.enderecos.length > 0 ? restaurante.enderecos[0] : null;

      if (!enderecoEntrega || !enderecoOrigem) {
        alert('Endereço de entrega ou do restaurante não encontrado.');
        this.isFinalizando = false;
        return;
      }

      // 3. Montar Payload (DTO)
      const pedidoDTO = {
        cliente: userId,
        restaurante: restauranteId,
        enderecoEntregaId: enderecoEntrega.idEndereco, // Ou .id se for o nome do campo
        enderecoOrigemId: enderecoOrigem.idEndereco,   // Ou .id
        itensPedido: this.itemsCarrinho.map(item => ({
          produtoId: item.produto.idProduto,
          qtQuantidade: item.qtQuantidade,
          dsObservacao: item.dsObservacao,
          adicionais: item.adicionais?.map(ad => ad.idAdicional) || []
        })),
        formaPagamento: "CREDITO", // Fixo conforme solicitado ou bindado de um select
        dsObservacoes: "Entrega rápida" // Fixo conforme solicitado ou bindado de um textarea
      };

      console.log('Enviando pedido:', pedidoDTO);

      // 4. Enviar Requisição
      // Obs: O TypeScript pode reclamar que pedidoDTO não bate com a interface Pedido. 
      // Usamos 'as any' para forçar o envio desse formato específico solicitado.
      this.pedidoService.criarPedido(pedidoDTO as any).subscribe({
        next: (pedidoCriado: any) => {
          alert('Pedido realizado com sucesso! 🍕');
          console.log(pedidoDTO)

          if (this.cupomAplicado && this.idCupomAplicado) {
             this.aplicarCupomNoPedido(pedidoCriado.idPedido);
          } else {
             this.sucessoFinalizacao();
          }

          
        },
        error: (err) => {
          console.log(pedidoDTO)
          console.error('Erro ao criar pedido:', err);
          alert('Ocorreu um erro ao finalizar o pedido. Tente novamente.');
          this.isFinalizando = false;
        }
      });

    } catch (error) {
      console.error('Erro ao buscar dados para finalizar:', error);
      alert('Erro de conexão ao preparar o pedido.');
      this.isFinalizando = false;
    }
  }

  private aplicarCupomNoPedido(idPedido: number) {
    if (!this.idCupomAplicado) return;

    console.log(`🎟️ Aplicando cupom ${this.idCupomAplicado} no pedido ${idPedido}...`);

    this.pedidoService.aplicarCupom(idPedido, this.idCupomAplicado).subscribe({
      next: () => {
        console.log('✅ Cupom vinculado com sucesso!');
        this.sucessoFinalizacao();
      },
      error: (err) => {
        console.error('❌ Erro ao vincular cupom:', err);
        alert('Pedido criado, mas houve um erro ao aplicar o desconto do cupom. Entre em contato com o suporte.');
        this.sucessoFinalizacao();
      }
    });
  }

  private sucessoFinalizacao() {
    alert('Pedido realizado com sucesso! 🍕');
    this.carrinhoService.limpar();
    this.isFinalizando = false;
    this.router.navigate(['/perfil']);
  }



  get vazio(): boolean {
    return this.itemsCarrinho.length === 0;
  }

  get subtotal(): number {
    return this.itemsCarrinho.reduce((total, item) => total + item.vlSubtotal, 0);
  }

  get total(): number {
    return Math.max(0, this.subtotal + this.taxaEntrega - this.valorDesconto);
  }
}