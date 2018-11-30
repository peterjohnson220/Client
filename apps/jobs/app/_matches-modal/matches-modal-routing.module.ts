import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyParticipationPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'survey-participation', pathMatch: 'full' },
  { path: 'survey-participation', component: SurveyParticipationPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesModalRoutingModule { }
