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
        path: 'company-admin',
        loadChildren: 'apps/admin/app/_company-admin/company-admin.module#CompanyAdminModule'
      },
      {
        path: 'job-description-management',
        loadChildren: 'apps/admin/app/_job-description-management/bulk-export-scheduler.module#JdmBulkExportSchedulerModule'
      },
      { path: 'marketing', loadChildren: 'apps/admin/app/_marketing/marketing.module#MarketingModule' },
      { path: 'community', loadChildren: 'apps/admin/app/_community/community.module#CommunityModule' },
      { path: 'org-data-loader',
        loadChildren: 'apps/admin/app/_org-data-loader/org-data-loader.module#OrgDataLoaderModule' },
      { path: 'tickets', loadChildren: 'apps/admin/app/_tickets/tickets.module#TicketsModule' },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}




