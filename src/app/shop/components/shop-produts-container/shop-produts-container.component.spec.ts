import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProdutsContainerComponent } from './shop-produts-container.component';

describe('ShopProdutsContainerComponent', () => {
  let component: ShopProdutsContainerComponent;
  let fixture: ComponentFixture<ShopProdutsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopProdutsContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopProdutsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
