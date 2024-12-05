import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthenticationService } from './authentication/services/authentication.service';
import { getCookie } from '../helpers/cookiesFunctions';
import { NetworkService } from './shared/services/network.service';

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
