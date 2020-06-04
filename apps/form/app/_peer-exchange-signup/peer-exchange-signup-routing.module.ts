import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'hospitality',
    loadChildren: () => import('apps/form/app/_peer-exchange-signup/hospitality-signup/hospitality-signup.module').then(m => m.HospitalitySignupModule)
  },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerExchangeSignupRoutingModule { }
