import { Component } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'shop-nav-bar',
  templateUrl: './shop-nav-bar.component.html',
  styleUrl: './shop-nav-bar.component.scss'
})
export class ShopNavBarComponent {


  public isVisible: boolean = false;


  constructor (public layoutService: LayoutService) {}

  public menuItems: MenuItem[] = [
    { label: 'Log out', icon: 'pi pi-fw pi-power-off' },
  ];

  openCart() {
    this.isVisible = true;
  }


  toggleCart(event: boolean) {
    console.log('toggleCart', event);

    this.isVisible = event;
  }



}
