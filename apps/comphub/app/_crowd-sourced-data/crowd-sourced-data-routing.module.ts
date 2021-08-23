import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrowdSourcedDataPageComponent } from './containers/pages/crowd-sourced-data';
import { CrowdSourcedDataPageGuard } from './guards';
import { JobSummaryPrintComponent } from './print/job-summary-print';

const routes: Routes = [
  { path: '', canActivate: [CrowdSourcedDataPageGuard], component: CrowdSourcedDataPageComponent },
  { path: 'print', canActivate: [CrowdSourcedDataPageGuard], component: JobSummaryPrintComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrowdSourcedDataRoutingModule {}
