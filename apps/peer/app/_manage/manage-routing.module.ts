import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeerTileEnabledGuard } from 'libs/security/guards';

import { ExchangeJobMappingPageComponent } from './containers/pages';
import { ExchangeExistsGuard } from '../shared/guards';

const routes: Routes = [
  { path: '', component: ExchangeJobMappingPageComponent, canActivate: [PeerTileEnabledGuard, ExchangeExistsGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
