import { Component } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout.service';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Router } from '@angular/router';
import { AuthStatus } from '../../../authentication/interfaces/auth-status.enum';

@Component({
  selector: 'shop-nav-bar',
  templateUrl: './shop-nav-bar.component.html',
  styleUrl: './shop-nav-bar.component.scss',
})
export class ShopNavBarComponent {
  public isVisible: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  public menuItems: MenuItem[] = [
    // Opcion de login que solo se muestra si el usuario no esta logueado
    {
      label: 'Iniciar sesión',
      icon: 'pi pi-fw pi-sign-in',
      command: () => this.router.navigate(['/auth']),
      visible: this.authenticationService.authStatus() === AuthStatus.notAuthenticated || this.authenticationService.authStatus() === AuthStatus.checking,
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-power-off',
      command: () => this.authenticationService.logout(),
      visible: this.authenticationService.authStatus() === AuthStatus.authenticated,
    },
  ];

  openCart() {
    this.isVisible = true;
  }

  toggleCart(event: boolean) {
    console.log('toggleCart', event);

    this.isVisible = event;
  }
}
