import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkExportSchedulerPageComponent } from './containers/pages';

const routes: Routes = [
  { path: 'bulk-export-scheduler', component: BulkExportSchedulerPageComponent },
  { path: '', redirectTo: 'bulk-export-scheduler', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JdmBulkExportSchedulerRoutingModule { }
