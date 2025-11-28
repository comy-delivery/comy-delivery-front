import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BuscaService } from '../../services/busca-service';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente-service';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private searchService = inject(BuscaService); 
  private authService = inject(AuthService);
  private clienteService = inject(ClienteService);

  enderecoExibicao: string = 'Faça login';

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);

    this.carregarEnderecoUsuario();
  }

  carregarEnderecoUsuario() {
    const userId = this.authService.getUserId();
    const role = this.authService.getUserRole();

    // Só busca se for um Cliente logado
    if (userId && role === 'CLIENTE') {
      this.clienteService.buscarClientePorId(userId).subscribe({
        next: (cliente) => {
          if (cliente.enderecos && cliente.enderecos.length > 0) {
            // Tenta pegar o endereço padrão, senão pega o primeiro da lista
            const endereco = cliente.enderecos.find((e: any) => e.isPadrao) || cliente.enderecos[0];
            
            // Define o logradouro para exibição
            this.enderecoExibicao = `${endereco.logradouro}, ${endereco.numero}`;
          } else {
            this.enderecoExibicao = 'Sem endereço cadastrado';
          }
        },
        error: (err) => {
          console.error('Erro ao carregar endereço:', err);
          this.enderecoExibicao = 'Indisponível';
        }
      });
    }
  }

  toggleTheme() {
    const html = document.documentElement;

    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-bs-theme', newTheme);

    localStorage.setItem('theme', newTheme);
  }

  onSearch(event: any) {
    const valor = event.target.value;
    this.searchService.updateSearch(valor);
  }
}
