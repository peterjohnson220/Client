import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { TabularReportBuilderGuard } from 'libs/security/guards';

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
  {
    path: 'custom-report/:dataViewId',
    component: CustomReportViewPageComponent,
    canActivate: [TabularReportBuilderGuard],
    data: {Permissions: [Permissions.TABULAR_REPORT_BUILDER], Check: PermissionCheckEnum.Single}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
