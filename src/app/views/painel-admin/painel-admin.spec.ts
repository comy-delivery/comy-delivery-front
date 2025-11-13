import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelAdmin } from './painel-admin';

describe('PainelAdmin', () => {
  let component: PainelAdmin;
  let fixture: ComponentFixture<PainelAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
