import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

@Component({
  selector: 'dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrl: './dashboard-menu.component.scss',
})
export class DashboardMenuComponent implements OnInit {

  model: any[] = [];

  constructor(
    public layoutService: LayoutService,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.model = [
      {
        label: `Rol: ${this.authenticationService.user()?.role}`,
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Graficas',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/dashboard/charts'],
          },
          {
            label: 'Tienda',
            icon: 'pi pi-fw pi-globe',
            routerLink: ['/store'],
          },
          {
            label: 'Productos',
            icon: 'pi pi-fw pi-pencil',
            routerLink: ['/dashboard/list-product'],
          },
          {
            label: 'Usuarios',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/dashboard/list-user'],
          },
          // Boton de categorias
          {
            label: 'Categorias',
            icon: 'pi pi-fw pi-tags',
            routerLink: ['/dashboard/list-category'],
          },
          // Boton de ordenes
          {
            label: 'Ordenes',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: ['/dashboard/list-order'],
          },
        ],
      },
    ];
  }
}
