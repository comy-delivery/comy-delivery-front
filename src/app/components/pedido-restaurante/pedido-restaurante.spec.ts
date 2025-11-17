import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoRestauranteComponent } from './pedido-restaurante';

describe('PedidoRestaurante', () => {
  let component: PedidoRestauranteComponent;
  let fixture: ComponentFixture<PedidoRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoRestauranteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
