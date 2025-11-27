import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-restaurante.html',
  styleUrls: ['./home-restaurante.scss']
})
export class HomeRestauranteComponent {

  opcao: string = 'config';

  restaurante: any = {
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
    imagemLogo: '',
    imagemBanner: '',
    enderecos: [
      {
        rua: '',
        numero: '',
        bairro: '',
        cidade: ''
      }
    ]
  };

 
  toggleDia(dia: string, event: any) {
    if (event.target.checked) {
      if (!this.restaurante.diasFuncionamento.includes(dia)) {
        this.restaurante.diasFuncionamento.push(dia);
      }
    } else {
      this.restaurante.diasFuncionamento =
        this.restaurante.diasFuncionamento.filter((d: string) => d !== dia);
    }
  }

 
  uploadLogo(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.restaurante.imagemLogo = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  uploadBanner(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.restaurante.imagemBanner = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

 
  salvarConfig() {
    console.log("Configurações salvas:", this.restaurante);
  }

  salvarEndereco() {
    console.log("Endereço salvo:", this.restaurante.enderecos[0]);
  }

  salvarCategoria() {
    console.log("Categoria salva:", this.restaurante.categoria);
  }

  salvarFuncionamento() {
    console.log("Funcionamento salvo:", {
      abertura: this.restaurante.horarioAbertura,
      fechamento: this.restaurante.horarioFechamento,
      dias: this.restaurante.diasFuncionamento
    });
  }

  salvarEntrega() {
    console.log("Tempo médio salvo:", this.restaurante.tempoMediaEntrega);
  }

  salvarFiscal() {
    console.log("CNPJ salvo:", this.restaurante.cnpj);
  }

}
