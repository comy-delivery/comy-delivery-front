import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoCliente } from './pedido-cliente';

describe('PedidoCliente', () => {
  let component: PedidoCliente;
  let fixture: ComponentFixture<PedidoCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
