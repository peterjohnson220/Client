import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';
import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { AppWrapperComponent } from 'libs/features/app-root';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'peer', pathMatch: 'full' },
      { path: 'peer', loadChildren: 'apps/admin/app/_peer/peer-admin.module#PeerAdminModule' },
      { path: 'access-denied', component: AccessDeniedPageComponent },
      {
        path: 'job-description-management',
        loadChildren: 'apps/admin/app/_job-description-management/bulk-export-scheduler.module#JdmBulkExportSchedulerModule'
      },
      { path: 'marketing', loadChildren: 'apps/admin/app/_marketing/marketing.module#MarketingModule' }, 
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}




