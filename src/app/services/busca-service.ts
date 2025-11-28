import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuscaService {
  private searchTerm = new BehaviorSubject<string>('');
  
  // Observable que os componentes (Home) vão escutar
  public search$ = this.searchTerm.asObservable();

  // Método que a Navbar vai chamar
  updateSearch(term: string) {
    this.searchTerm.next(term);
  }
  
}
