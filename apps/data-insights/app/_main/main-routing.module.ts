import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomReportViewPageComponent, DataInsightsPageComponent, ReportViewPageComponent } from './containers/pages';
import { ReportViewTypes } from './models';

const routes: Routes = [
  { path: '', component: DataInsightsPageComponent },
  { path: 'standard-reports/:workbookName/:viewName', component: ReportViewPageComponent,
    data: { viewType: ReportViewTypes.StandardWorkbookSheet } },
  { path: 'standard-reports/:workbookId', component: ReportViewPageComponent, data: { viewType: ReportViewTypes.StandardWorkbook } },
  { path: 'company-reports/:workbookName/:viewName', component: ReportViewPageComponent,
    data: { viewType: ReportViewTypes.CompanyWorkbookSheet } },
  { path: 'company-reports/:workbookId', component: ReportViewPageComponent, data: { viewType: ReportViewTypes.CompanyWorkbook } },
  { path: 'custom-report', component: CustomReportViewPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
