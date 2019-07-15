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
      { path: 'peer', loadChildren: () => import('apps/admin/app/_peer/peer-admin.module').then(m => m.PeerAdminModule) },
      { path: 'access-denied', component: AccessDeniedPageComponent },
      {
        path: 'company-admin',
        loadChildren: () => import('apps/admin/app/_company-admin/company-admin.module').then(m => m.CompanyAdminModule)
      },
      {
        path: 'job-description-management',
        loadChildren: () => import('apps/admin/app/_job-description-management/bulk-export-scheduler.module')
          .then(m => m.JdmBulkExportSchedulerModule)
      },
      { path: 'marketing', loadChildren: () => import('apps/admin/app/_marketing/marketing.module').then(m => m.MarketingModule) },
      { path: 'community', loadChildren: () => import('apps/admin/app/_community/community.module').then(m => m.CommunityModule) },
      { path: 'org-data-loader',
        loadChildren: () => import('apps/admin/app/_org-data-loader/org-data-loader.module').then(m => m.OrgDataLoaderModule) },
      { path: 'tickets', loadChildren: () => import('apps/admin/app/_tickets/tickets.module').then(m => m.TicketsModule) },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}




