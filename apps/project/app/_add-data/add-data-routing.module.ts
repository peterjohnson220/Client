import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSurveyDataPageComponent, MultiMatchPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'surveys', pathMatch: 'full' },
  { path: 'surveys', component: AddSurveyDataPageComponent },
  { path: 'multi-match', component: MultiMatchPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDataRoutingModule { }
