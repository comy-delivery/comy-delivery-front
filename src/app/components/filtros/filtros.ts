import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtros',
  imports: [FormsModule  ],
  templateUrl: './filtros.html',
  styleUrl: './filtros.scss',
})
export class Filtros {
  @Output() filtrosAlterados = new EventEmitter<any>();

  filtroPreco: string = 'todos';
  filtroAvaliacao: string = 'todos';

  atualizarFiltros() {
    this.filtrosAlterados.emit({
      preco: this.filtroPreco,
      avaliacao: this.filtroAvaliacao
    });
  }

}
