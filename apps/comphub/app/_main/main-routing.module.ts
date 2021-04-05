import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComphubPageComponent, TrendsPageComponent } from './containers/pages';
import { PfAdminGuard } from '../../../../libs/security/guards';

const routes: Routes = [
  { path: '', component: ComphubPageComponent },
  { path: 'trends', component: TrendsPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
