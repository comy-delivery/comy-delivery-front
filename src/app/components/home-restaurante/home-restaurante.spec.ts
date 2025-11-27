import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HomeRestauranteComponent } from './home-restaurante';

describe('HomeRestauranteComponent', () => {
  let component: HomeRestauranteComponent;
  let fixture: ComponentFixture<HomeRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeRestauranteComponent,  
        HttpClientTestingModule     
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
