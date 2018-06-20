import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveysPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'surveys', pathMatch: 'full' },
  { path: 'surveys', component: SurveysPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDataRoutingModule { }
