import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';
import { PeerTileEnabledGuard } from 'libs/security/guards';

import { AddDataCutPageComponent } from './containers/pages/add-data-cut';

const routes: Routes = [
  { path: '', redirectTo: 'add-data-cut', pathMatch: 'full' },
  { path: 'add-data-cut', component: AddDataCutPageComponent, canActivate: [PeerTileEnabledGuard] },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerRoutingModule { }
