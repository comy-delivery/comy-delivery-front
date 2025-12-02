import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosRestaurante } from './pedidos-restaurante';

describe('PedidosRestaurante', () => {
  let component: PedidosRestaurante;
  let fixture: ComponentFixture<PedidosRestaurante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosRestaurante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosRestaurante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
