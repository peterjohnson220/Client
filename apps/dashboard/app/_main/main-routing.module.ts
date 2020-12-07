import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent, MarketingPageComponent } from './containers/pages';
import { TimelineActivityComponent } from './containers/timeline-activity';
import { CompositeSummaryDownloadComponent } from './components/composite-summary-download/composite-summary-download.component';

const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'composite-load-summary', component: CompositeSummaryDownloadComponent },
  { path: '', component: TimelineActivityComponent, outlet: 'rightSidebarContent' },
  { path: 'marketing', children: [
    { path: 'data-insights', component: MarketingPageComponent },
    { path: 'employees', component: MarketingPageComponent },
    { path: 'international-data', component: MarketingPageComponent },
    { path: 'job-descriptions', component: MarketingPageComponent },
    { path: 'jobs', component: MarketingPageComponent },
    { path: 'pay-markets', component: MarketingPageComponent },
    { path: 'peer', component: MarketingPageComponent },
    { path: 'pricing-projects', component: MarketingPageComponent },
    { path: 'structures', component: MarketingPageComponent },
    { path: 'surveys', component: MarketingPageComponent },
    { path: 'total-rewards', component: MarketingPageComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
