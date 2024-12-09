import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardFooterComponent } from './components/dashboard-footer/dashboard-footer.component';
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { DashboardTopBarComponent } from './components/dashboard-top-bar/dashboard-top-bar.component';
import { DashboardMenuItemComponent } from './components/dashboard-menu-item/dashboard-menu-item.component';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ListProductComponent } from './pages/list-product/list-product.component';
import { ListUserComponent } from './pages/list-user/list-user.component';

@NgModule({
  declarations: [
    DashboardFooterComponent,
    DashboardMenuComponent,
    DashboardTopBarComponent,
    DashboardMenuItemComponent,
    DashboardLayoutComponent,
    DashboardSidebarComponent,
    ListProductComponent,
    ListUserComponent
  ],
  imports: [CommonModule, DashboardRoutingModule, PrimeNgModule],
})
export class DashboardModule {}
