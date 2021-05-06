import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PfServicesAdminByRepositoryGuard } from 'libs/security/guards';

import {
  SurveyLoaderComponent
} from './containers';

const routes: Routes = [
  {
    path: 'survey-loader',
    component: SurveyLoaderComponent,
    canActivate: [PfServicesAdminByRepositoryGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyLoadersRoutingModule { }
