import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopLayoutPageComponent } from './pages/shop-layout-page/shop-layout-page.component';

const routes: Routes = [
  {
    path: '',
    component: ShopLayoutPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
