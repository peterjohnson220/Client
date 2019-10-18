import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './containers/pages';
import { TimelineActivityComponent } from './containers/timeline-activity';
import { CompositeSummaryDownloadComponent } from './components/composite-summary-download/composite-summary-download.component';
import { ResourcesComponent } from './containers/resources/resources.component';
import { CompanyResourcesPageComponent } from './containers/pages/company-resources/company-resources.page';

const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'composite-load-summary', component: CompositeSummaryDownloadComponent },
  { path: '', component: TimelineActivityComponent, outlet: 'rightSidebarContent' },
  { path: 'resources', component: ResourcesComponent },
  { path: 'company-resources', component: CompanyResourcesPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
