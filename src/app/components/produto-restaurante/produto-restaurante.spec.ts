import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoRestaurante } from './produto-restaurante';

describe('ProdutoRestaurante', () => {
  let component: ProdutoRestaurante;
  let fixture: ComponentFixture<ProdutoRestaurante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoRestaurante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoRestaurante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
