import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { PeerTileEnabledGuard } from 'libs/security/guards';

import { ExchangeJobMappingPageComponent } from './containers/pages';
import { ExchangeExistsGuard } from '../shared/guards';

const routes: Routes = [
  { path: 'job-mapping/:id', component: ExchangeJobMappingPageComponent, canActivate: [PeerTileEnabledGuard, ExchangeExistsGuard] },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'exchange-not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
