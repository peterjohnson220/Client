import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PfAdminGuard} from 'libs/security/guards';

import { MarketingSettingsComponent } from './containers';


const routes: Routes = [
  { path: 'marketing-settings', component: MarketingSettingsComponent, canActivate: [PfAdminGuard] },
  { path: '', redirectTo: 'marketing-settings', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
