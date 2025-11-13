import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelEntregador } from './painel-entregador';

describe('PainelEntregador', () => {
  let component: PainelEntregador;
  let fixture: ComponentFixture<PainelEntregador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelEntregador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelEntregador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
