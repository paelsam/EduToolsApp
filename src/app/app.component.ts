import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthenticationService } from './authentication/services/authentication.service';
import { getCookie } from '../helpers/cookiesFunctions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    if (!getCookie('csrftoken')) {
      this.authenticationService.loadCSRFToken();
    }
  }

}
