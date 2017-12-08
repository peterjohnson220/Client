import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeListPageComponent, ManageExchangePageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'exchanges', pathMatch: 'full' },
  { path: 'exchanges', component: ExchangeListPageComponent },
  { path: 'exchange', component: ManageExchangePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerAdminRoutingModule { }
