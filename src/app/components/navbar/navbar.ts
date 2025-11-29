import { Component, inject, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterLink } from '@angular/router';
import { BuscaService } from '../../services/busca-service';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente-service';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private searchService = inject(BuscaService); 
  private authService = inject(AuthService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  enderecoExibicao: string = 'Faça login';

  placeholderTexto: string = 'Buscar restaurante ou categoria';
  searchTerm: string = '';

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);

    this.carregarEnderecoUsuario();

    // Monitorar mudanças de rota para atualizar o placeholder e limpar a busca
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.atualizarEstadoBusca(event.url);
    });

    // Inicializa o estado correto ao carregar a página (ex: F5 no cardápio)
    this.atualizarEstadoBusca(this.router.url);
  }

  atualizarEstadoBusca(url: string) {
    // Limpa a busca ao trocar de tela para não filtrar coisas erradas na nova tela
    this.searchTerm = '';
    this.searchService.updateSearch('');

    // Define o texto do placeholder baseado na rota
    if (url.includes('/cardapio')) {
      this.placeholderTexto = 'Buscar produto';
    } else {
      this.placeholderTexto = 'Buscar restaurante ou categoria';
    }
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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Redireciona para o perfil correto baseado na role do usuário
   */
  irParaPerfil(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const role = this.authService.getUserRole();
    
    switch(role) {
      case 'CLIENTE':
        this.router.navigate(['/perfil']);
        break;
      case 'RESTAURANTE':
        this.router.navigate(['/restaurante']); //Vai para home-restaurante (edição)
        break;
      case 'ENTREGADOR':
        this.router.navigate(['/entregador']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  onSearch(valor: string) {
    this.searchService.updateSearch(valor);
  }

  logout(): void {
  this.authService.logout();
}
}