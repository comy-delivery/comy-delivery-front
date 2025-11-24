import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.scss',
})
export class Categoria {
  categories: { name: string; svg?: SafeHtml; iconUrl?: string }[];

  constructor(private sanitizer: DomSanitizer) {
    const svgs: { [k: string]: string } = {
      todos: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-grid-3x3" viewBox="0 0 16 16">
          <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5zM1.5 1a.5.5 0 0 0-.5.5V5h4V1zM5 6H1v4h4zm1 4h4V6H6zm-1 1H1v3.5a.5.5 0 0 0 .5.5H5zm1 0v4h4v-4zm5 0v4h3.5a.5.5 0 0 0 .5-.5V11zm0-1h4V6h-4zm0-5h4V1.5a.5.5 0 0 0-.5-.5H11zm-1 0V1H6v4z"/>
        </svg>
      `,
      lanches: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-grid-3x3" viewBox="0 0 512 512"><path d="M48 384c-8.8 0-16 7.2-16 16 0 44.2 35.8 80 80 80l288 0c44.2 0 80-35.8 80-80 0-8.8-7.2-16-16-16L48 384zM32 202c0 12.2 9.9 22 22 22L458 224c12.2 0 22-9.9 22-22 0-17.2-2.6-34.4-10.8-49.5-22.2-40.8-82.3-120.5-213.2-120.5S65 111.6 42.8 152.5C34.6 167.6 32 184.8 32 202zM0 304c0 17.7 14.3 32 32 32l448 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 272c-17.7 0-32 14.3-32 32zM256 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM120 128a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm248-24a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
      `,
      pizzaria: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-grid-3x3" viewBox="0 0 512 512"><path d="M169.7 .9c-22.8-1.6-41.9 14-47.5 34.7L112.5 72C293.3 72.3 439.7 218.7 440 399.5l36.4-9.7c20.8-5.5 36.3-24.7 34.7-47.5-12.6-182.8-158.6-328.8-341.4-341.4zm222 411.5c.2-4.1 .3-8.2 .3-12.4 0-154.6-125.4-280-280-280-4.1 0-8.3 .1-12.4 .3L.5 491.9c-1.5 5.5 .1 11.4 4.1 15.4s9.9 5.6 15.4 4.1l371.6-99.1zM176 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM96 384a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
      `,
      doce: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-grid-3x3" viewBox="0 0 512 512""><path d="M448 384c-28.02 0-31.26-32-74.5-32-43.43 0-46.825 32-74.75 32-27.695 0-31.454-32-74.75-32-42.842 0-47.218 32-74.5 32-28.148 0-31.202-32-74.75-32-43.547 0-46.653 32-74.75 32v-80c0-26.5 21.5-48 48-48h16V112h64v144h64V112h64v144h64V112h64v144h16c26.5 0 48 21.5 48 48v80zm0 128H0v-96c43.356 0 46.767-32 74.75-32 27.951 0 31.253 32 74.75 32 42.843 0 47.217-32 74.5-32 28.148 0 31.201 32 74.75 32 43.357 0 46.767-32 74.75-32 27.488 0 31.252 32 74.5 32v96zM96 96c-17.75 0-32-14.25-32-32 0-31 32-23 32-64 12 0 32 29.5 32 56s-14.25 40-32 40zm128 0c-17.75 0-32-14.25-32-32 0-31 32-23 32-64 12 0 32 29.5 32 56s-14.25 40-32 40zm128 0c-17.75 0-32-14.25-32-32 0-31 32-23 32-64 12 0 32 29.5 32 56s-14.25 40-32 40z"/></svg>
      `,
      asiatica: `
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fork-knife" viewBox="0 0 16 16">
      <path d="M13 .5c0-.276-.226-.506-.498-.465-1.703.257-2.94 2.012-3 8.462a.5.5 0 0 0 .498.5c.56.01 1 .13 1 1.003v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5zM4.25 0a.25.25 0 0 1 .25.25v5.122a.128.128 0 0 0 .256.006l.233-5.14A.25.25 0 0 1 5.24 0h.522a.25.25 0 0 1 .25.238l.233 5.14a.128.128 0 0 0 .256-.006V.25A.25.25 0 0 1 6.75 0h.29a.5.5 0 0 1 .498.458l.423 5.07a1.69 1.69 0 0 1-1.059 1.711l-.053.022a.92.92 0 0 0-.58.884L6.47 15a.971.971 0 1 1-1.942 0l.202-6.855a.92.92 0 0 0-.58-.884l-.053-.022a1.69 1.69 0 0 1-1.059-1.712L3.462.458A.5.5 0 0 1 3.96 0z"/>
      </svg>
      `,
      saudavel: `
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-leaf" viewBox="0 0 16 16">
      <path d="M1.4 1.7c.216.289.65.84 1.725 1.274 1.093.44 2.884.774 5.834.528l.37-.023c1.823-.06 3.117.598 3.956 1.579C14.16 6.082 14.5 7.41 14.5 8.5c0 .58-.032 1.285-.229 1.997q.198.248.382.54c.756 1.2 1.19 2.563 1.348 3.966a1 1 0 0 1-1.98.198c-.13-.97-.397-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.125-.887-1.89-2.095-2.391-3.383C.16 6.62.16 3.646.509 1.902L.73.806zm-.05 1.39c-.146 1.609-.008 3.809.74 5.728.457 1.17 1.13 2.213 2.079 2.961.942.744 2.185 1.22 3.83 1.221 2.588 0 3.91-.66 4.609-1.445-1.789-2.46-4.121-1.213-6.342-2.68-.74-.488-1.735-1.323-1.844-2.308-.023-.214.237-.274.38-.112 1.4 1.6 3.573 1.757 5.59 2.045 1.227.215 2.21.526 3.033 1.158.058-.39.075-.782.075-1.158 0-.91-.288-1.988-.975-2.792-.626-.732-1.622-1.281-3.167-1.229l-.316.02c-3.05.253-5.01-.08-6.291-.598a5.3 5.3 0 0 1-1.4-.811"/>
      </svg>
      `,

      brasileira: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="0.75" y="0.75" width="30.5" height="18.5" rx="0.8" ry="0.8" fill="none" stroke-width="1"/>
        <polygon points="16,2.2 28.2,10 16,17.8 3.8,10" fill="none" stroke-width="1"/>
        <circle cx="16" cy="10" r="3.3" fill="none" stroke-width="1"/>
        <path d="M11.2 10c1.1-1.1 2.9-1.6 4.8-1.6 1.9 0 3.7.5 4.8 1.6" fill="none" stroke-width="1"/>
      </svg>
      `,
    };

    this.categories = [
      { name: 'Todos', svg: this.sanitizer.bypassSecurityTrustHtml(svgs['todos']) },
      { name: 'Lanches', svg: this.sanitizer.bypassSecurityTrustHtml(svgs['lanches']) },
      { name: 'Pizzaria', svg: this.sanitizer.bypassSecurityTrustHtml(svgs['pizzaria']) },
      { name: 'Doces', svg: this.sanitizer.bypassSecurityTrustHtml(svgs['doce']) },
      { name: 'Asiática', svg: this.sanitizer.bypassSecurityTrustHtml(svgs['asiatica']) },
      { name: 'Saudável', svg: this.sanitizer.bypassSecurityTrustHtml(svgs['saudavel']) },
      {
        name: 'Brasileira',
        svg: this.sanitizer.bypassSecurityTrustHtml(svgs['brasileira']),
        iconUrl: 'assets/icons/brasileira.svg',
      },
    ];
  }

  protected categoriaSelecionada: string = 'Todos';

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }
}
