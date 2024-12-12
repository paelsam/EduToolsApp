import { Component, effect, OnInit } from '@angular/core';
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

  // Verificar el cambio de estado de autenticación con un effect
  public authStatusChangedEffect = effect(() => {
    switch (this.authenticationService.authStatus()) {
      case AuthStatus.authenticated:
        this.menuItems[0].visible = false;
        this.menuItems[1].visible = true;
        break;
      case AuthStatus.notAuthenticated:
        this.menuItems[0].visible = true;
        this.menuItems[1].visible = false;
        break;
      default:
        break;
    }
  });

  public menuItems: MenuItem[] = [
    // Opcion de login que solo se muestra si el usuario no esta logueado
    {
      label: 'Iniciar sesión',
      icon: 'pi pi-fw pi-sign-in',
      command: () => this.router.navigate(['/auth']),
      visible:
        this.authenticationService.authStatus() ===
          AuthStatus.notAuthenticated ||
        this.authenticationService.authStatus() === AuthStatus.checking,
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        this.authenticationService.logout();
        this.router.navigate(['/auth']);
      },
      visible:
        this.authenticationService.authStatus() === AuthStatus.authenticated,
    },
  ];

  openCart() {
    this.isVisible = true;
  }

  toggleCart(event: boolean) {
    this.isVisible = event;
  }
}
