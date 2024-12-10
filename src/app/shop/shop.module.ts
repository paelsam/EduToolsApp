import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopLayoutPageComponent } from './pages/shop-layout-page/shop-layout-page.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ShopNavBarComponent } from './components/shop-nav-bar/shop-nav-bar.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopHeroImageComponent } from './components/shop-hero-image/shop-hero-image.component';
import { ShopProdutsContainerComponent } from './components/shop-produts-container/shop-produts-container.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ShopFooterComponent } from './components/shop-footer/shop-footer.component';
import { ShopCartComponent } from './components/shop-cart/shop-cart.component';
import { ProductService } from '../shared/services/product.service';
import { ConfirmationService } from 'primeng/api';



@NgModule({
  declarations: [
    ShopLayoutPageComponent,
    ShopNavBarComponent,
    ShopHeroImageComponent,
    ShopProdutsContainerComponent,
    ShopFooterComponent,
    ShopCartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ShopRoutingModule,
    PrimeNgModule
  ],
  providers: [ProductService, ConfirmationService]
})
export class ShopModule { }
