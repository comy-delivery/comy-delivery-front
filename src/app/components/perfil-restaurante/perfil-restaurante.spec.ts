import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilRestaurante } from './perfil-restaurante';
import { PedidoRestauranteComponent } from '../pedido-restaurante/pedido-restaurante';

describe('PerfilRestaurante', () => {
  let component: PerfilRestaurante;
  let fixture: ComponentFixture<PerfilRestaurante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PerfilRestaurante,
        PedidoRestauranteComponent 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilRestaurante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
