import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasEntregador } from './entregas-entregador';

describe('EntregasEntregador', () => {
  let component: EntregasEntregador;
  let fixture: ComponentFixture<EntregasEntregador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasEntregador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasEntregador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
