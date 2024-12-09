import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';
import { ListProductComponent } from './pages/list-product/list-product.component';
import { ProductService } from '../shared/services/product.service';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { CustomerService } from '../shared/services/customer.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'list-product', component: ListProductComponent },
      { path: 'list-user', component: ListUserComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [ProductService, CustomerService],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

