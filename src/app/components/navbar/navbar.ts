import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BuscaService } from '../../services/busca-service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private searchService = inject(BuscaService); 
  
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
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
