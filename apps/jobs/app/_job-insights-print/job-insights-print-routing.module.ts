import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { JobInsightsPrintPageComponent } from './job-insights-print.page';

const routes: Routes = [
  {
    path: ':companyJobId/:companyPayMarketId',
    component: JobInsightsPrintPageComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobInsightsPrintRoutingModule { }
