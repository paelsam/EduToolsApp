import { Component } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout-service.service';

@Component({
  selector: 'app-auth-layout-page',
  templateUrl: './auth-layout-page.component.html',
  styleUrl: './auth-layout-page.component.scss'
})
export class AuthLayoutPageComponent {
  constructor(
    public layoutService: LayoutService
  ) {}
}
