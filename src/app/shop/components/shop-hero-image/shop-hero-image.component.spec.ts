import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopHeroImageComponent } from './shop-hero-image.component';

describe('ShopHeroImageComponent', () => {
  let component: ShopHeroImageComponent;
  let fixture: ComponentFixture<ShopHeroImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopHeroImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopHeroImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
