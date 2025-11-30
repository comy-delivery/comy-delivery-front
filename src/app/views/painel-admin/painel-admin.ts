import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RestauranteService } from '../../services/restaurante-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './painel-admin.html',
  styleUrls: ['./painel-admin.scss'],
})
export class PainelAdmin {
  private restauranteService = inject(RestauranteService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isSaving = false;
  successMessage = '';
  errorMessage = '';

  logoFile?: File | null = null;
  bannerFile?: File | null = null;

  restaurante: any = {
    username: '',
    password: '',
    nmRestaurante: '',
    emailRestaurante: '',
    cnpj: '',
    telefoneRestaurante: '',
    descricaoRestaurante: '',
    categoria: '',
    horarioAbertura: '',
    horarioFechamento: '',
    diasFuncionamento: [],
    tempoMediaEntrega: null,
    enderecos: [
      {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        cep: '',
        estado: '',
        tipoEndereco: '',
        isPadrao: true,
      },
    ],
  };

  toggleDia(dia: string, event: any): void {
    if (event.target.checked) {
      if (!this.restaurante.diasFuncionamento.includes(dia)) {
        this.restaurante.diasFuncionamento.push(dia);
      }
    } else {
      this.restaurante.diasFuncionamento = this.restaurante.diasFuncionamento.filter(
        (d: string) => d !== dia
      );
    }
  }

  onLogoChange(event: any): void {
    const f = event.target.files && event.target.files[0];
    if (f) this.logoFile = f;
  }

  onBannerChange(event: any): void {
    const f = event.target.files && event.target.files[0];
    if (f) this.bannerFile = f;
  }

  cadastrar(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validação simples no cliente
    if (
      !this.restaurante.username ||
      !this.restaurante.password ||
      !this.restaurante.nmRestaurante
    ) {
      this.errorMessage = 'Preencha username, password e nome do restaurante.';
      return;
    }

    if (!this.restaurante.enderecos || this.restaurante.enderecos.length === 0) {
      this.restaurante.enderecos = [
        { logradouro: '', numero: '', cidade: '', cep: '', isPadrao: true },
      ];
    }

    // Normalizar tempoMediaEntrega: enviar apenas se for número
    const payload: any = JSON.parse(JSON.stringify(this.restaurante));
    if (payload.tempoMediaEntrega === null || payload.tempoMediaEntrega === '') {
      delete payload.tempoMediaEntrega;
    } else {
      payload.tempoMediaEntrega = Number(payload.tempoMediaEntrega);
      if (isNaN(payload.tempoMediaEntrega)) delete payload.tempoMediaEntrega;
    }

    this.isSaving = true;

    console.log('Enviando payload (restaurante):', payload);
    if (this.logoFile) console.log('Logo file present:', this.logoFile.name);
    if (this.bannerFile) console.log('Banner file present:', this.bannerFile.name);

    this.restauranteService
      .cadastrarRestaurante(payload, this.logoFile ?? undefined, this.bannerFile ?? undefined)
      .subscribe({
        next: (res) => {
          console.log('Restaurante cadastrado:', res);
          this.successMessage = 'Restaurante cadastrado com sucesso!';
          this.isSaving = false;
          this.restaurante = {
            username: '',
            password: '',
            nmRestaurante: '',
            emailRestaurante: '',
            cnpj: '',
            telefoneRestaurante: '',
            descricaoRestaurante: '',
            categoria: '',
            horarioAbertura: '',
            horarioFechamento: '',
            diasFuncionamento: [],
            tempoMediaEntrega: null,
            enderecos: [
              {
                logradouro: '',
                numero: '',
                bairro: '',
                cidade: '',
                cep: '',
                estado: '',
                tipoEndereco: '',
                isPadrao: true,
              },
            ],
          };
          this.logoFile = null;
          this.bannerFile = null;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);

          const createdId =
            res && (res.id || res.idRestaurante || res.idUsuario || res.restauranteId);
          if (createdId) {
            const idNum = Number(createdId);
            console.log('Tentando disponibilizar/abrir restaurante id=', idNum);

            forkJoin({
              disponibilizar: this.restauranteService.disponibilizarRestaurante(idNum),
              abrir: this.restauranteService.abrirRestaurante(idNum),
            }).subscribe({
              next: (results) => {
                console.log('Disponibilizar result:', results.disponibilizar);
                console.log('Abrir result:', results.abrir);
                try {
                  this.restauranteService.notifyRestaurantesChanged();
                } catch (e) {
                  console.warn('notify error', e);
                }
              },
              error: (e) => {
                console.warn('Erro em disponibilizar/abrir:', e);
                try {
                  this.restauranteService.notifyRestaurantesChanged();
                } catch (err) {
                  console.warn('notify error', err);
                }
              },
            });
          } else {
            console.log(
              'Resposta não contém id do restaurante, não foi possível marcar disponível/aberto automaticamente.'
            );
            try {
              this.restauranteService.notifyRestaurantesChanged();
            } catch (e) {
              console.warn('notify error', e);
            }
          }
        },
        error: (err) => {
          console.error('Erro ao cadastrar restaurante', err);
          // Mostrar detalhes para ajudar no debug
          const status = err && err.status ? err.status : 'unknown';
          const serverMsg = err && err.error ? err.error : err;
          this.errorMessage = `Erro ${status}: ${
            serverMsg && serverMsg.message ? serverMsg.message : JSON.stringify(serverMsg)
          }`;
          this.isSaving = false;
        },
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
