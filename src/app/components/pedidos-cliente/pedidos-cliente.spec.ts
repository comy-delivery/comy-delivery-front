import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosCliente } from './pedidos-cliente';

describe('PedidosCliente', () => {
  let component: PedidosCliente;
  let fixture: ComponentFixture<PedidosCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
