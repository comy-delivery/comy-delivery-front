import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemRestaurantes } from './listagem-restaurantes';

describe('ListagemRestaurantes', () => {
  let component: ListagemRestaurantes;
  let fixture: ComponentFixture<ListagemRestaurantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemRestaurantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemRestaurantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
