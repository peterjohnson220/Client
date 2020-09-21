import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SurveyComponent } from './containers/survey/survey.component';
import { PfAdminGuard } from 'libs/security';
import { SurveyTitlesPageComponent } from './containers/survey-titles';

const routes: Routes = [
  { path: 'surveys/:id', component: SurveyComponent, canActivate: [PfAdminGuard] },
  { path: 'survey-titles/:id', component: SurveyTitlesPageComponent, canActivate: [PfAdminGuard]},
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SurveyLibraryRoutingModule { }

