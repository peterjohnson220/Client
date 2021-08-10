import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfAdminGuard } from 'libs/security';

import { TrendsPageComponent } from './containers';

const routes: Routes = [
  { path: '', canActivate: [PfAdminGuard], component: TrendsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerTrendsDataRoutingModule {}
