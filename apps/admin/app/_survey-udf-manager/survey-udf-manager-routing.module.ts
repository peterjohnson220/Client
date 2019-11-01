import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PfAdminGuard } from 'libs/security';

import { UdfManagerPageComponent } from './';

const routes: Routes = [
  { path: '', component: UdfManagerPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyUdfManagerRoutingModule { }
