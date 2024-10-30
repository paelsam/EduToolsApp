import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLayoutPageComponent } from './auth-layout-page.component';

describe('AuthLayoutPageComponent', () => {
  let component: AuthLayoutPageComponent;
  let fixture: ComponentFixture<AuthLayoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthLayoutPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthLayoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
