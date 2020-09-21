import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import { UserContextGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';
import { TokenExpirationPageComponent, PublicTokenDraftDescriptionPageComponent } from 'libs/ui/common/error/pages';
import { WorkflowStepCompletionPageComponent } from './shared/components/workflow-step-completion';
import { SsoAuthGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      {
        path: '', loadChildren: () => import('apps/job-description-management/app/_job-description/job-description.module')
          .then(m => m.JobDescriptionModule), canActivate: [SsoAuthGuard]
      },
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
  { path: 'workflow-complete', component: WorkflowStepCompletionPageComponent },
  { path: 'public-token-draft', component: PublicTokenDraftDescriptionPageComponent },
  { path: 'token-expired', component: TokenExpirationPageComponent },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
