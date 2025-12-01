import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EntregaService } from '../../services/entrega-service';
import { PedidoService } from '../../services/pedido-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-entregas-entregador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entregas-entregador.html',
  styleUrls: ['./entregas-entregador.scss']
})
export class EntregasEntregadorComponent implements OnInit {
  private entregaService = inject(EntregaService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  entregasAtribuidas: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.carregarEntregasDoEntregador();
  }

  carregarEntregasDoEntregador() {
    const entregadorId = this.authService.getUserId();

    if (!entregadorId) {
      console.error('❌ Entregador não identificado');
      this.isLoading = false;
      return;
    }

    console.log('🔍 Buscando entregas do entregador ID:', entregadorId);

    this.entregaService.buscarEntregasDoEntregador(entregadorId).subscribe({
      next: (entregas) => {
        console.log('✅ Entregas recebidas:', entregas);
        this.entregasAtribuidas = entregas || [];

        // Carregar detalhes do pedido para cada entrega
        this.entregasAtribuidas.forEach((entrega) => {
          console.log(`📦 Entrega #${entrega.id} - Status: ${entrega.statusEntrega}`);
          this.carregarDetalhesPedido(entrega);
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao buscar entregas:', err);
        this.isLoading = false;
      }
    });
  }

  carregarDetalhesPedido(entrega: any) {
    if (!entrega.pedidoId) return;

    this.pedidoService.buscarPedidoPorId(entrega.pedidoId).subscribe({
      next: (pedido: any) => {
        entrega.pedidoFull = pedido;

        // Calcular distância
        if (pedido.enderecoOrigem && pedido.enderecoEntrega) {
          const lat1 = pedido.enderecoOrigem.latitude;
          const lon1 = pedido.enderecoOrigem.longitude;
          const lat2 = pedido.enderecoEntrega.latitude;
          const lon2 = pedido.enderecoEntrega.longitude;

          if (lat1 && lon1 && lat2 && lon2) {
            entrega.distanciaCalculada = this.calcularDistancia(lat1, lon1, lat2, lon2);
          }
        }
      },
      error: (err) => console.error(`❌ Erro ao buscar pedido ${entrega.pedidoId}:`, err)
    });
  }

  /**
   * PENDENTE -> EM_ROTA
   * Entregador está indo buscar o pedido no restaurante
   */
  iniciarRota(entrega: any) {
  const entregadorId = this.authService.getUserId();
  
  if (!entregadorId) {
    alert('Erro: Entregador não identificado');
    return;
  }

  console.log(`🚀 Iniciando rota da entrega #${entrega.id}`);
  console.log('📍 Status atual:', entrega.statusEntrega);
  console.log('👤 Entregador ID:', entregadorId);
  console.log('📤 Payload que será enviado:', { status: 'EM_ROTA', entregadorId: entregadorId }); // 🆕

  if (!confirm('Deseja iniciar a rota para buscar este pedido no restaurante?')) {
    return;
  }

  this.entregaService.iniciarRota(entrega.id, entregadorId).subscribe({
    next: (response) => {
      console.log('✅ Rota iniciada com sucesso:', response);
      entrega.statusEntrega = 'EM_ROTA';
      alert('Rota iniciada! Vá buscar o pedido no restaurante. 🏍️');
    },
    error: (err) => {
      console.error('❌ Erro ao iniciar rota:', err);
      console.error('❌ Status HTTP:', err.status); // 🆕
      console.error('❌ Mensagem:', err.message); // 🆕
      console.error('❌ Erro completo do backend:', err.error); // 🆕
      console.error('❌ URL chamada:', err.url); // 🆕
      
      // Exibir erro formatado
      const mensagemErro = err.error?.message || err.error?.detail || err.message || 'Erro desconhecido';
      alert(`Erro ao iniciar rota:\n\n${mensagemErro}`);
    }
  });
}
  /**
   * EM_ROTA -> CONCLUIDA
   * Entregador chegou e entregou o pedido ao cliente
   */
  concluirEntrega(entrega: any) {
    console.log(`✅ Concluindo entrega #${entrega.id}`);
    console.log('📍 Status atual:', entrega.statusEntrega);

    if (!confirm('Confirmar que o pedido foi entregue ao cliente?')) {
      return;
    }

    this.entregaService.concluirEntrega(entrega.id).subscribe({
      next: (response) => {
        console.log('✅ Entrega concluída com sucesso:', response);
        
        // Remove da lista
        this.entregasAtribuidas = this.entregasAtribuidas.filter(e => e.id !== entrega.id);
        
        alert('Entrega concluída com sucesso! 🎉\nValor recebido: R$ ' + entrega.valorEntrega.toFixed(2));
      },
      error: (err) => {
        console.error('❌ Erro ao concluir entrega:', err);
        console.error('❌ Detalhes:', err.error);
        alert(`Erro ao concluir entrega: ${err.error?.message || err.message}`);
      }
    });
  }

  voltarParaPainel() {
    this.router.navigate(['/entregador']);
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'PENDENTE': return 'bg-warning text-dark';
      case 'EM_ROTA': return 'bg-primary';
      case 'CONCLUIDA': return 'bg-success';
      case 'CANCELADA': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusTexto(status: string): string {
    switch(status) {
      case 'PENDENTE': return 'Aguardando Início';
      case 'EM_ROTA': return 'Em Rota';
      case 'CONCLUIDA': return 'Concluída';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  }

  getStatusDescricao(status: string): string {
    switch(status) {
      case 'PENDENTE': return 'Clique em "Iniciar Rota" para ir buscar o pedido';
      case 'EM_ROTA': return 'Indo buscar/entregar o pedido';
      case 'CONCLUIDA': return 'Pedido entregue com sucesso';
      case 'CANCELADA': return 'Entrega cancelada';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'PENDENTE': return 'bi-hourglass-split';
      case 'EM_ROTA': return 'bi-truck';
      case 'CONCLUIDA': return 'bi-check-circle-fill';
      case 'CANCELADA': return 'bi-x-circle-fill';
      default: return 'bi-question-circle';
    }
  }
}