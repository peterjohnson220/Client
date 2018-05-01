import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeerTileEnabledGuard } from 'libs/security/guards';

import { ExchangeListPageComponent, ExchangeDashboardPageComponent } from './containers/pages';
import { ExchangeExistsGuard } from '../shared/guards';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ExchangeListPageComponent, canActivate: [PeerTileEnabledGuard] },
  { path: ':id', component: ExchangeDashboardPageComponent, canActivate: [PeerTileEnabledGuard, ExchangeExistsGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
