import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeMapNewPageComponent, ExchangeMapPageComponent } from './containers/pages';
import { PeerExchangeExplorerEnabledGuard } from 'libs/security/guards';

const routes: Routes = [
  { path: '', component: ExchangeMapPageComponent, canActivate: [PeerExchangeExplorerEnabledGuard] },
  { path: 'new', component: ExchangeMapNewPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
