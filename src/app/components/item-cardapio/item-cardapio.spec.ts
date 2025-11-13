import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardapio } from './item-cardapio';

describe('ItemCardapio', () => {
  let component: ItemCardapio;
  let fixture: ComponentFixture<ItemCardapio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCardapio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCardapio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
