import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfAdminGuard } from 'libs/security/guards';

import { QuickPricePageComponent, TrendsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: QuickPricePageComponent },
  { path: 'trends', component: TrendsPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
