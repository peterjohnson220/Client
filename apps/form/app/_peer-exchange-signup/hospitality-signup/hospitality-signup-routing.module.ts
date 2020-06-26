import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalitySignupPageComponent, HospitalitySignupSuccessPageComponent } from './pages';

const routes: Routes = [
  { path: '', component: HospitalitySignupPageComponent },
  { path: 'success', component: HospitalitySignupSuccessPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalitySignupRoutingModule { }
