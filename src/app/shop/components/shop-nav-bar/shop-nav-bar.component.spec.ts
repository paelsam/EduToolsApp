import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopNavBarComponent } from './shop-nav-bar.component';

describe('ShopNavBarComponent', () => {
  let component: ShopNavBarComponent;
  let fixture: ComponentFixture<ShopNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
