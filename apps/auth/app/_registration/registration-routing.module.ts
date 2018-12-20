import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  RegistrationFormPageComponent,
  ValidateRegistrationPageComponent
} from './containers/pages';

import { RegistrationEnabledGuard } from './services/registration-enabled.guard';

const routes: Routes = [
  { path: '', redirectTo: 'form', pathMatch: 'full' },
  { path: 'form', component: RegistrationFormPageComponent, canActivate: [RegistrationEnabledGuard] },
  { path: 'validate', component: ValidateRegistrationPageComponent, canActivate: [RegistrationEnabledGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
