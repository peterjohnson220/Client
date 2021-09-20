import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { JobSummaryPrintComponent } from './containers/job-summary-print';

const routes: Routes = [
  {
    path: ':id',
    component: JobSummaryPrintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule { }
