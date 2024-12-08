import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { isNotAuthenticatedGuard } from './authentication/guards/is-not-authenticated.guard';
import { isAuthenticatedGuard } from './authentication/guards/is-authenticated.guard';

const routes: Routes = [
  { path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },

  { path: 'store',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) },

  { path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },

  { path: '', redirectTo: '/store', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
