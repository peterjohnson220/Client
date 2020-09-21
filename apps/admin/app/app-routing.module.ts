import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';
import { AppWrapperComponent } from 'libs/features/app-root';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: 'peer', loadChildren: () => import('apps/admin/app/_peer/peer-admin.module').then(m => m.PeerAdminModule) },
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
      {
        path: 'org-data-loader',
        loadChildren: () => import('apps/admin/app/_org-data-loader/org-data-loader.module').then(m => m.OrgDataLoaderModule)
      },
      { path: 'tickets', loadChildren: () => import('apps/admin/app/_tickets/tickets.module').then(m => m.TicketsModule) },
      {
        path: 'data-insights',
        loadChildren: () => import('apps/admin/app/_data-insights/data-insights.module').then(m => m.DataInsightsModule)
      },
      {
        path: 'survey-library', loadChildren: () => import('apps/admin/app/_survey-library/survey-library.module')
          .then(m => m.SurveyLibraryModule)
      },
      {
        path: 'sso', loadChildren: () => import('apps/admin/app/_sso/sso.module').then(m => m.SsoModule)
      },
      {
        path: 'survey-udf-manager', loadChildren: () => import('apps/admin/app/_survey-udf-manager/survey-udf-manager.module')
          .then(m => m.SurveyUdfManagerModule)
      },
      {
        path: 'jobs-hierarchy', loadChildren: () => import('apps/admin/app/_jobs-hierarchy/jobs-hierarchy.module')
          .then(m => m.JobsHierarchyModule)
      },
      { path: 'not-found', redirectTo: '/not-found' },
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
