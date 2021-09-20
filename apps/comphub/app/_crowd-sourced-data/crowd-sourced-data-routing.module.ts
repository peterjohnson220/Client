import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrowdSourcedDataPageComponent } from './containers';
import { CrowdSourcedDataPageGuard } from './guards';

const routes: Routes = [
  { path: '', canActivate: [CrowdSourcedDataPageGuard], component: CrowdSourcedDataPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrowdSourcedDataRoutingModule {}
