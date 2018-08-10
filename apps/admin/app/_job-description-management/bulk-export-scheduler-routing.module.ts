import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyAdminGuard } from 'libs/security/guards';
import { BulkExportSchedulerPageComponent } from './containers/pages';

const routes: Routes = [
  { path: 'bulk-export-scheduler', component: BulkExportSchedulerPageComponent, canActivate: [CompanyAdminGuard] },
  { path: '', redirectTo: 'bulk-export-scheduler', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JdmBulkExportSchedulerRoutingModule { }
