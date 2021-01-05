import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';
import { AppNoWrapperComponent } from 'libs/features/infrastructure/app-root';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: '',
    component: AppNoWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'add-data', pathMatch: 'full' },
      { path: 'add-data', loadChildren: () => import('apps/project/app/_add-data/add-data.module').then(m => m.AddDataModule) },
      { path: 'add-jobs', loadChildren: () => import('apps/project/app/_add-jobs/add-jobs.module').then(m => m.AddJobsModule) },
      { path: 'multi-match', loadChildren: () => import('apps/project/app/_multi-match/multi-match-page.module').then(m => m.MultiMatchPageModule) }
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
