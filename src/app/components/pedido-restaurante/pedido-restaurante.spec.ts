import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoRestaurante } from './pedido-restaurante';

describe('PedidoRestaurante', () => {
  let component: PedidoRestaurante;
  let fixture: ComponentFixture<PedidoRestaurante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoRestaurante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoRestaurante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
