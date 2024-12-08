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
    private messageService: MessageService,
    private router: Router
  ) {}

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authenticationService.authStatus() === 'checking') {
      return false;
    }
    return true;
  });

  // public authStatusChangedEffect = effect(() => {
  //   console.log(this.authenticationService.authStatus());

  //   switch (this.authenticationService.authStatus()) {
  //     case AuthStatus.checking:
  //       break;
  //     case AuthStatus.authenticated:
  //       console.log('Rol del usuario:', this.authenticationService.role());
  //       if (
  //         this.authenticationService.role() === Roles.ADMIN ||
  //         this.authenticationService.role() === Roles.STAFF
  //       ) {
  //         this.router.navigate(['/dashboard']);
  //       }
  //       if (this.authenticationService.role() === Roles.CLIENT) {
  //         //! No necesariamente tiene que ser /store
  //         //! Arrerglar para que redireccione a la página correcta
  //         //! En base al las páginas que puede ver el cliente
  //         this.router.navigate(['/store']);
  //       }
  //       break;
  //     case AuthStatus.notAuthenticated:
  //       this.router.navigate(['/store']);
  //       break;
  //   }
  // });

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
