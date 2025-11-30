import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntregaService } from '../../services/entrega-service';

@Component({
  selector: 'app-entrega-disponivel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrega-disponivel.html',
  styleUrl: './entrega-disponivel.scss',
})
export class EntregaDisponivel implements OnInit {
  private entregaService = inject(EntregaService);

  entregas: any[] = [];

  ngOnInit(): void {
    this.carregarEntregasDisponiveis();
  }

  carregarEntregasDisponiveis() {
    this.entregaService.buscarEntregasDisponiveis().subscribe({
      next: (res) => (this.entregas = res || []),
      error: (err) => console.error('Erro ao buscar entregas:', err),
    });
  }

  aceitarEntrega(entrega: any) {
    const id = entrega?.id;
    if (!id) return;
    this.entregaService.aceitarEntrega(id).subscribe({
      next: () => {
        this.entregas = this.entregas.filter((e) => e.id !== id);
      },
      error: (err) => console.error('Erro ao aceitar entrega:', err),
    });
  }
}
