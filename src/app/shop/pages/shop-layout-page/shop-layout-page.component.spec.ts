import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLayoutPageComponent } from './shop-layout-page.component';

describe('ShopLayoutPageComponent', () => {
  let component: ShopLayoutPageComponent;
  let fixture: ComponentFixture<ShopLayoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopLayoutPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopLayoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
