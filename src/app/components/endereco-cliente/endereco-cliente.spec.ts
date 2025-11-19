import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoCliente } from './endereco-cliente';

describe('EnderecoCliente', () => {
  let component: EnderecoCliente;
  let fixture: ComponentFixture<EnderecoCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnderecoCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnderecoCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
