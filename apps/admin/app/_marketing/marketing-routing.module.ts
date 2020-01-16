import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PfAdminGuard} from 'libs/security/guards';

import { MarketingImageComponent } from './containers';


const routes: Routes = [
  { path: 'marketing-image', component: MarketingImageComponent, canActivate: [PfAdminGuard] },
  { path: '', redirectTo: 'marketing-image', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
