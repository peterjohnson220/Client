import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { PeerTileEnabledGuard } from 'libs/security/guards';

import {
  ExchangeListPageComponent,
  ExchangeJobMappingPageComponent,
  ExchangeDashboardPageComponent
} from './containers/pages';
import { ExchangeExistsGuard } from './guards';

const routes: Routes = [
  { path: '', redirectTo: 'exchanges', pathMatch: 'full' },
  { path: 'exchanges', component: ExchangeListPageComponent, canActivate: [PeerTileEnabledGuard] },
  { path: 'exchange/:id', component: ExchangeDashboardPageComponent, canActivate: [PeerTileEnabledGuard, ExchangeExistsGuard] },
  { path: 'exchange/job-mapping/:id', component: ExchangeJobMappingPageComponent,
    canActivate: [PeerTileEnabledGuard, ExchangeExistsGuard] },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'exchange-not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
