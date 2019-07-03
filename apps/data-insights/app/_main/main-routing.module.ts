import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataInsightsPageComponent, ReportViewPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: DataInsightsPageComponent },
  { path: 'standard-reports/:workbookId', component: ReportViewPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
