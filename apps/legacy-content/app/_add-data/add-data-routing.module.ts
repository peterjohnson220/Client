import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSurveyDataPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'surveys', pathMatch: 'full' },
  { path: 'surveys', component: AddSurveyDataPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDataRoutingModule { }
