import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ForgotPasswordPageComponent,
  LoginPageComponent
} from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
