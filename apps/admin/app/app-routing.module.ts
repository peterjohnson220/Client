import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard, PfAdminGuard } from 'libs/security';
import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { AppWrapperComponent } from 'libs/features/app-root';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: 'peer', canActivate: [PfAdminGuard],  loadChildren: () => import('apps/admin/app/_peer/peer-admin.module').then(m => m.PeerAdminModule) },
      { path: 'access-denied', component: AccessDeniedPageComponent },
      {
        path: 'company-admin', canActivate: [PfAdminGuard],
        loadChildren: () => import('apps/admin/app/_company-admin/company-admin.module').then(m => m.CompanyAdminModule)
      },
      {
        path: 'job-description-management', canActivate: [PfAdminGuard],
        loadChildren: () => import('apps/admin/app/_job-description-management/bulk-export-scheduler.module')
          .then(m => m.JdmBulkExportSchedulerModule)
      },
      { path: 'marketing', canActivate: [PfAdminGuard], loadChildren: () => import('apps/admin/app/_marketing/marketing.module').then(m => m.MarketingModule) },
      { path: 'community', canActivate: [PfAdminGuard], loadChildren: () => import('apps/admin/app/_community/community.module').then(m => m.CommunityModule) },
      {
        path: 'org-data-loader', canActivate: [PfAdminGuard],
        loadChildren: () => import('apps/admin/app/_org-data-loader/org-data-loader.module').then(m => m.OrgDataLoaderModule)
      },
      { path: 'tickets', loadChildren: () => import('apps/admin/app/_tickets/tickets.module').then(m => m.TicketsModule) },
      {
        path: 'data-insights', canActivate: [PfAdminGuard],
        loadChildren: () => import('apps/admin/app/_data-insights/data-insights.module').then(m => m.DataInsightsModule)
      },
      {
        path: 'survey-library', canActivate: [PfAdminGuard], loadChildren: () => import('apps/admin/app/_survey-library/survey-library.module')
          .then(m => m.SurveyLibraryModule)
      },
      {
        path: 'survey-udf-manager', canActivate: [PfAdminGuard], loadChildren: () => import('apps/admin/app/_survey-udf-manager/survey-udf-manager.module')
          .then(m => m.SurveyUdfManagerModule)
      },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
