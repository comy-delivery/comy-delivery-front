import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';
import { PedidoService } from '../../services/pedido-service';
import { AuthService } from '../../services/auth-service';
import { Pedido } from '../../Shared/models/Pedido';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-pedidos-restaurante',
  standalone: true,
  imports: [CommonModule, PedidoRestauranteComponent],
  template: `
    <div class="container-fluid py-3">
      
      <!-- 🆕 DEBUG INFO -->
      <div class="alert alert-info mb-3">
        <strong>🔄 Atualização automática ativa</strong> - 
        Última atualização: {{ ultimaAtualizacao | date:'HH:mm:ss' }}
        <button class="btn btn-sm btn-primary ms-3" (click)="carregarPedidos()">
          <i class="bi bi-arrow-clockwise"></i> Forçar Atualização
        </button>
      </div>

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><i class="bi bi-receipt"></i> Meus Pedidos</h2>
          <p class="text-muted">Total: {{ pedidos.length }} pedido(s)</p>
        </div>
      </div>

      <!-- Tabs de Status -->
      <ul class="nav nav-pills mb-4">
        <li class="nav-item">
          <button class="nav-link" [class.active]="filtroStatus === 'TODOS'" (click)="filtrarPor('TODOS')">
            Todos ({{ pedidos.length }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="filtroStatus === 'PENDENTE'" (click)="filtrarPor('PENDENTE')">
            Pendentes ({{ contarPorStatus('PENDENTE') }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="filtroStatus === 'CONFIRMADO'" (click)="filtrarPor('CONFIRMADO')">
            Confirmados ({{ contarPorStatus('CONFIRMADO') }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="filtroStatus === 'EM_PREPARO'" (click)="filtrarPor('EM_PREPARO')">
            Em Preparo ({{ contarPorStatus('EM_PREPARO') }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="filtroStatus === 'PRONTO'" (click)="filtrarPor('PRONTO')">
            Prontos ({{ contarPorStatus('PRONTO') }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="filtroStatus === 'SAIU_PARA_ENTREGA'" (click)="filtrarPor('SAIU_PARA_ENTREGA')">
            Em Rota ({{ contarPorStatus('SAIU_PARA_ENTREGA') }})
          </button>
        </li>
      </ul>

      <!-- Loading -->
      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3">Carregando pedidos...</p>
      </div>

      <!-- Lista de Pedidos -->
      <div *ngIf="!isLoading">
        <div *ngFor="let pedido of pedidosFiltrados; trackBy: trackByPedidoId" class="mb-3">
          <app-pedido-restaurante 
            [pedido]="pedido"
            (pedidoAtualizado)="onPedidoAtualizado($event)"
            (pedidoRemovido)="onPedidoRemovido($event)">
          </app-pedido-restaurante>
        </div>

        <!-- Nenhum pedido -->
        <div *ngIf="pedidosFiltrados.length === 0" class="alert alert-warning">
          <i class="bi bi-info-circle"></i> Nenhum pedido encontrado com esse filtro.
        </div>
      </div>

    </div>
  `,
  styles: [`
    .nav-pills .nav-link {
      color: #6c757d;
      cursor: pointer;
    }
    .nav-pills .nav-link.active {
      background-color: #0d6efd;
    }
  `]
})
export class PedidosRestauranteComponent implements OnInit, OnDestroy {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  filtroStatus: string = 'TODOS';
  isLoading = true;
  ultimaAtualizacao: Date = new Date();
  
  private subscription?: Subscription;

  ngOnInit(): void {
    console.log('🚀 Iniciando componente de pedidos do restaurante');
    this.carregarPedidos();
    
    // 🔥 ATUALIZAÇÃO AUTOMÁTICA usando RxJS
    this.subscription = interval(10000).pipe(
      switchMap(() => {
        console.log('🔄 Atualizando pedidos automaticamente...');
        return this.pedidoService.listarPorRestaurante(this.authService.getUserId()!);
      })
    ).subscribe({
      next: (pedidos) => {
        console.log('✅ Pedidos atualizados automaticamente:', pedidos.length);
        this.pedidos = pedidos;
        this.ultimaAtualizacao = new Date();
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar automaticamente:', err);
      }
    });
  }

  ngOnDestroy(): void {
    console.log('🛑 Desativando atualização automática');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  carregarPedidos(): void {
    const restauranteId = this.authService.getUserId();
    
    if (!restauranteId) {
      console.error('❌ ID do restaurante não encontrado');
      this.isLoading = false;
      return;
    }

    console.log('📥 Carregando pedidos do restaurante ID:', restauranteId);

    this.pedidoService.listarPorRestaurante(restauranteId).subscribe({
      next: (pedidos) => {
        console.log('✅ Pedidos carregados:', pedidos);
        console.log('📊 Status dos pedidos:', pedidos.map(p => `#${p.idPedido}: ${p.status}`));
        this.pedidos = pedidos;
        this.ultimaAtualizacao = new Date();
        this.aplicarFiltro();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar pedidos:', err);
        this.isLoading = false;
      }
    });
  }

  filtrarPor(status: string): void {
    console.log('🔍 Filtrando por:', status);
    this.filtroStatus = status;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    if (this.filtroStatus === 'TODOS') {
      this.pedidosFiltrados = this.pedidos;
    } else {
      this.pedidosFiltrados = this.pedidos.filter(p => p.status === this.filtroStatus);
    }
    console.log(`✅ Filtro aplicado: ${this.pedidosFiltrados.length} de ${this.pedidos.length} pedidos`);
  }

  contarPorStatus(status: string): number {
    return this.pedidos.filter(p => p.status === status).length;
  }

  onPedidoAtualizado(pedidoAtualizado: Pedido): void {
    console.log('🔄 Pedido atualizado:', pedidoAtualizado.idPedido, pedidoAtualizado.status);
    const index = this.pedidos.findIndex(p => p.idPedido === pedidoAtualizado.idPedido);
    if (index !== -1) {
      this.pedidos[index] = pedidoAtualizado;
      this.aplicarFiltro();
    }
  }

  onPedidoRemovido(idPedido: number | undefined): void {
    if (!idPedido) return;
    console.log('🗑️ Removendo pedido:', idPedido);
    this.pedidos = this.pedidos.filter(p => p.idPedido !== idPedido);
    this.aplicarFiltro();
  }

  trackByPedidoId(index: number, pedido: Pedido): number {
    return pedido.idPedido || index;
  }
}