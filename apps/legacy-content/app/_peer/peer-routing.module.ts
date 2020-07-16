import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';
import { PeerTileEnabledGuard } from 'libs/security/guards';

import {
  AssociateCompanyJobComponent, PaymarketExchangeScopeComponent,
  UpsertDataCutPageComponent
} from './containers';
import { TaggingEntitiesPageComponent } from './containers/pages/tagging-entities';

const routes: Routes = [
  { path: '', redirectTo: 'upsert-data-cut', pathMatch: 'full' },
  { path: 'associate-exchange-job', component: AssociateCompanyJobComponent },
  { path: 'exchange-paymarket-scope', component: PaymarketExchangeScopeComponent, canActivate: [PeerTileEnabledGuard] },
  { path: 'tag-entities', component: TaggingEntitiesPageComponent },
  { path: 'upsert-data-cut', component: UpsertDataCutPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerRoutingModule { }
