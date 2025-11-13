import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRestaurante } from './card-restaurante';

describe('CardRestaurante', () => {
  let component: CardRestaurante;
  let fixture: ComponentFixture<CardRestaurante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRestaurante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRestaurante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
