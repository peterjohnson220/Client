import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import { UserContextGuard } from 'libs/security';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', loadChildren: () => import('apps/job-description-management/app/_job-description/job-description.module')
          .then(m => m.JobDescriptionModule) },
      {
        path: 'job-descriptions',
        loadChildren: () => import('apps/job-description-management/app/_job-description/job-description.module')
          .then(m => m.JobDescriptionModule)
      },
      {
        path: 'templates',
        loadChildren: () => import('apps/job-description-management/app/_templates/templates.module')
          .then(m => m.TemplatesModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('apps/job-description-management/app/_settings/settings.module')
          .then(m => m.SettingsModule)
      }
    ]
  },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
