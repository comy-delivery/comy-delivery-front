import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entregador } from './entregador';

describe('Entregador', () => {
  let component: Entregador;
  let fixture: ComponentFixture<Entregador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entregador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entregador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
