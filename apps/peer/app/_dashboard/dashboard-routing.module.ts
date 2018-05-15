import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeerTileEnabledGuard } from 'libs/security/guards';

import { ExchangeDashboardPageComponent, NoExchangesPageComponent } from './containers/pages';
import { ExchangeExistsGuard } from '../shared/guards';
import { RedirectToExchangeComponent } from './components/redirect-to-exchange/redirect-to-exchange.component';

const routes: Routes = [
  {
    path: '',
    component: ExchangeDashboardPageComponent,
    canActivate: [ PeerTileEnabledGuard, ExchangeExistsGuard]
  },
  {
    path: 'redirect',
    component: RedirectToExchangeComponent
  },
  {
    path: 'no-exchanges',
    component: NoExchangesPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
