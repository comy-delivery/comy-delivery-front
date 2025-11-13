import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entrega } from './entrega';

describe('Entrega', () => {
  let component: Entrega;
  let fixture: ComponentFixture<Entrega>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entrega]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entrega);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
