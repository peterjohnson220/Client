import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/infrastructure/app-root';
import { UserContextGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'company-jobs', pathMatch: 'full' },
      { path: 'company-jobs', loadChildren: () => import('apps/jobs/app/_jobs-page/jobs-page.module').then(m => m.JobsPageModule) }
    ]
  },
  {
    path: 'matches-modal', loadChildren: () => import('apps/jobs/app/_matches-modal/matches-modal.module')
      .then(m => m.MatchesModalModule)
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
