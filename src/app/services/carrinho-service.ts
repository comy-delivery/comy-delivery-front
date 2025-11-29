import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemPedido } from '../Shared/models/ItemPedido';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private storageKey = 'carrinho_v1'; // Nome da chave no navegador

  // 1. INICIALIZAÇÃO: Tenta ler do LocalStorage. Se não tiver nada, inicia vazio [].
  private itensSource = new BehaviorSubject<ItemPedido[]>(this.lerDoStorage());

  // As páginas se inscrevem aqui
  itensCarrinho$ = this.itensSource.asObservable();

  constructor() {}

  // --- MÉTODOS PÚBLICOS ---

  adicionar(novoItem: ItemPedido): void {
    const itensAtuais = this.itensSource.value;

    // Lógica de verificação de duplicidade (igual fizemos antes)
    const jaExiste = itensAtuais.find((item) => {
      if (item.produto.idProduto !== novoItem.produto.idProduto) return false;
      if ((item.dsObservacao || '').trim() !== (novoItem.dsObservacao || '').trim()) return false;

      const idsAntigos = item.adicionais
        .map((a) => a.idAdicional)
        .sort()
        .toString();
      const idsNovos = novoItem.adicionais
        .map((a) => a.idAdicional)
        .sort()
        .toString();

      return idsAntigos === idsNovos;
    });

    if (jaExiste) {
      alert('Este item exatamente igual já está no carrinho.');
      return;
    }

    // Cria nova lista
    const novaLista = [...itensAtuais, novoItem];

    // 2. ATUALIZA: Manda para a memória (BehaviorSubject) E para o LocalStorage
    this.atualizarEstado(novaLista);

    alert('Adicionado ao carrinho!');
  }

  remover(index: number): void {
    const itensAtuais = this.itensSource.value;
    if (index > -1 && index < itensAtuais.length) {
      itensAtuais.splice(index, 1);
      // Atualiza memória e storage
      this.atualizarEstado([...itensAtuais]);
    }
  }

  atualizarItem(index: number, itemAtualizado: ItemPedido): void {
    const itensAtuais = this.itensSource.value;
    if (index >= 0 && index < itensAtuais.length) {
      itensAtuais[index] = itemAtualizado;
      // Salva no localStorage e notifica os componentes
      this.atualizarEstado([...itensAtuais]); 
    }
  }

  limpar(): void {
    this.atualizarEstado([]);
  }

  obterValorAtual(): ItemPedido[] {
    return this.itensSource.value;
  }

  // --- MÉTODOS PRIVADOS (AUXILIARES) ---

  // Centraliza a atualização para garantir que memória e storage andem juntos
  private atualizarEstado(novaLista: ItemPedido[]) {
    this.itensSource.next(novaLista); // Avisa os componentes
    localStorage.setItem(this.storageKey, JSON.stringify(novaLista)); // Salva no navegador
  }

  // Lê do navegador ao abrir o site
  private lerDoStorage(): ItemPedido[] {
    // Verifica se estamos no navegador (segurança para SSR/Angular Universal)
    if (typeof localStorage !== 'undefined') {
      const dadosSalvos = localStorage.getItem(this.storageKey);
      if (dadosSalvos) {
        try {
          return JSON.parse(dadosSalvos);
        } catch (e) {
          console.error('Erro ao ler carrinho do storage', e);
          return [];
        }
      }
    }
    return [];
  }
}
