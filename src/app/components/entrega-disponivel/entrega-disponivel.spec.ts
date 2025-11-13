import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaDisponivel } from './entrega-disponivel';

describe('EntregaDisponivel', () => {
  let component: EntregaDisponivel;
  let fixture: ComponentFixture<EntregaDisponivel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregaDisponivel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregaDisponivel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
