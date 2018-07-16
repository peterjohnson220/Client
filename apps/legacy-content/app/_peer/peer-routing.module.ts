import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';
import { PeerTileEnabledGuard } from 'libs/security/guards';

import { UpsertDataCutPageComponent } from './containers/pages/upsert-data-cut';

const routes: Routes = [
  { path: '', redirectTo: 'upsert-data-cut', pathMatch: 'full' },
  { path: 'upsert-data-cut', component: UpsertDataCutPageComponent, canActivate: [PeerTileEnabledGuard] },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerRoutingModule { }
