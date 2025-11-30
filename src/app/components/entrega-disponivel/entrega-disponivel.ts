import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntregaService } from '../../services/entrega-service';
import { PedidoService } from '../../services/pedido-service';
import { EntregadorService } from '../../services/entregador-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-entrega-disponivel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrega-disponivel.html',
  styleUrl: './entrega-disponivel.scss',
})
export class EntregaDisponivel implements OnInit {
  private entregaService = inject(EntregaService);
  private pedidoService = inject(PedidoService);
  private entregadorService = inject(EntregadorService);
  private authService = inject(AuthService);

  @Output() entregaAceita = new EventEmitter<void>();

  entregas: any[] = [];

  ngOnInit(): void {
    this.carregarEntregasDisponiveis();
  }

  carregarEntregasDisponiveis() {
    this.entregaService.buscarEntregasDisponiveis().subscribe({
      next: (res) => {
        this.entregas = res || [];
        
        // Para cada entrega, busca os detalhes do pedido para pegar endereços e calcular distância
        this.entregas.forEach((entrega) => {
          this.carregarDetalhesPedido(entrega);
        });
      },
      error: (err) => console.error('Erro ao buscar entregas:', err),
    });
  }

  carregarDetalhesPedido(entrega: any) {
    if (!entrega.pedidoId) return;

    this.pedidoService.buscarPedidoPorId(entrega.pedidoId).subscribe({
      next: (pedido: any) => {
        // Anexa o pedido completo ao objeto de entrega
        entrega.pedidoFull = pedido;

        // Se tivermos as coordenadas, calculamos a distância
        if (pedido.enderecoOrigem && pedido.enderecoEntrega) {
          const lat1 = pedido.enderecoOrigem.latitude;
          const lon1 = pedido.enderecoOrigem.longitude;
          const lat2 = pedido.enderecoEntrega.latitude;
          const lon2 = pedido.enderecoEntrega.longitude;

          if (lat1 && lon1 && lat2 && lon2) {
            entrega.distanciaCalculada = this.calcularDistanciaHaversine(lat1, lon1, lat2, lon2);
          }
        }
      },
      error: (err) => console.error(`Erro ao buscar pedido ${entrega.pedidoId}:`, err)
    });
  }

  // Fórmula de Haversine para calcular distância entre duas coordenadas geográficas
  private calcularDistanciaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em km
    
    return distancia;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  aceitarEntrega(entrega: any) {
    const idEntrega = entrega?.id;
    const idEntregador = this.authService.getUserId();

    if (!idEntrega || !idEntregador) {
      console.error('ID da entrega ou do entregador inválido.');
      return;
    }

    // Chama o novo endpoint de atribuição
    this.entregadorService.atribuirEntrega(idEntregador, idEntrega).subscribe({
      next: () => {
        // Remove da lista local
        this.entregas = this.entregas.filter((e) => e.id !== idEntrega);
        // Avisa o componente pai para atualizar o contador
        this.entregaAceita.emit();
        alert('Entrega aceita com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao aceitar entrega:', err);
        alert('Erro ao aceitar a entrega. Tente novamente.');
      },
    });
  }
}
