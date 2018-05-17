import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserContextGuard } from 'libs/security';

import {
  FirstLoginPageComponent,
  ForgotPasswordPageComponent,
  LoginPageComponent
} from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'first-login', component: FirstLoginPageComponent, canLoad: [UserContextGuard] },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  { path: 'login', component: LoginPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
