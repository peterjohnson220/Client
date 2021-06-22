import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrowdSourcedDataPageComponent } from './containers/pages/crowd-sourced-data';
import { CrowdSourcedDataPageGuard } from './guards';

const routes: Routes = [
  { path: '', canActivate: [CrowdSourcedDataPageGuard], component: CrowdSourcedDataPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrowdSourcedDataRoutingModule {}
