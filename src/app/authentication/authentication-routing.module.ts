import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutPageComponent } from './pages/auth-layout-page/auth-layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { VerifyUserComponent } from './pages/verify-user/verify-user.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutPageComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
      { path: 'verify-user/:userId/:token', component: VerifyUserComponent },
      { path: '**', redirectTo: 'login'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
