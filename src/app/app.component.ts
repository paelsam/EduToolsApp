import { Component, computed, effect, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthenticationService } from './authentication/services/authentication.service';
import { getCookie } from '../helpers/cookiesFunctions';
import { NetworkService } from './shared/services/network.service';
import { Router } from '@angular/router';
import { AuthStatus } from './authentication/interfaces/auth-status.enum';
import { Roles } from './shared/interfaces/roles.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private wasOnline: boolean = navigator.onLine;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    console.log('App iniciada');
    console.log(this.authenticationService.authStatus());
    this.primengConfig.ripple = true;
    if (!getCookie('csrftoken')) {
      this.authenticationService.loadCSRFToken();
    }

    this.networkService.isOnline$.subscribe((isOnline) => {
      if (isOnline !== this.wasOnline) {
        this.wasOnline = isOnline;
        this.messageService.add({
          severity: isOnline ? 'success' : 'error',
          summary: isOnline ? 'Conexión Restaurada' : 'Conexión Perdida',
          detail: isOnline
            ? 'Has recuperado la conexión a internet'
            : 'No tienes conexión a internet',
        });
      }
    });
  }
}
