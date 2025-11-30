import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestauranteService } from '../../services/restaurante-service';

@Component({
  selector: 'app-listagem-restaurantes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listagem-restaurantes.html'
})
export class ListagemRestaurantesComponent implements OnInit {

  restaurantes: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  excluindoId: number | null = null;
  restauranteParaExcluir: any = null;

  constructor(private restauranteService: RestauranteService) {}

  ngOnInit(): void {
    this.carregarRestaurantes();
  }

  carregarRestaurantes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.restauranteService.listarAtivos().subscribe({
      next: (data: any[]) => {
        console.log('✅ Restaurantes carregados:', data);
        this.restaurantes = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Erro ao carregar restaurantes:', error);
        this.errorMessage = 'Erro ao carregar restaurantes. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  confirmarExclusao(restaurante: any): void {
    this.restauranteParaExcluir = restaurante;
  }

  cancelarExclusao(): void {
    this.restauranteParaExcluir = null;
  }

  excluirRestaurante(): void {
    if (!this.restauranteParaExcluir) return;

    const id = this.restauranteParaExcluir.id;
    this.excluindoId = id;
    this.errorMessage = '';
    this.successMessage = '';

    this.restauranteService.excluirRestaurante(id).subscribe({
      next: () => {
        console.log('✅ Restaurante excluído com sucesso:', id);
        this.successMessage = `Restaurante "${this.restauranteParaExcluir.nmRestaurante}" excluído com sucesso!`;
        
        // Remove da lista
        this.restaurantes = this.restaurantes.filter(r => r.id !== id);
        
        // Fecha o modal e reseta estados
        this.restauranteParaExcluir = null;
        this.excluindoId = null;

        // Remove mensagem após 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error: any) => {
        console.error('❌ Erro ao excluir restaurante:', error);
        this.errorMessage = 'Erro ao excluir restaurante. Tente novamente.';
        this.excluindoId = null;
        this.restauranteParaExcluir = null;
      }
    });
  }

}