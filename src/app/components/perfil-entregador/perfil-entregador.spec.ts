import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEntregador } from './perfil-entregador';

describe('PerfilEntregador', () => {
  let component: PerfilEntregador;
  let fixture: ComponentFixture<PerfilEntregador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilEntregador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilEntregador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
