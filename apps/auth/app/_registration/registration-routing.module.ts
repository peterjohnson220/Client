import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  RegistrationFormPageComponent,
  ValidateRegistrationPageComponent
} from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'form', pathMatch: 'full' },
  { path: 'form', component: RegistrationFormPageComponent },
  { path: 'validate', component: ValidateRegistrationPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
