import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeerTileEnabledGuard, UserContextGuard } from 'libs/security';
import { AppNoWrapperComponent } from 'libs/features/app-root';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: 'peer-job-association',
    component: AppNoWrapperComponent,
    canActivate: [UserContextGuard, PeerTileEnabledGuard],
    children: [
      { path: '', loadChildren:
          () => import('apps/legacy-content/app/_peer-job-association/peer-job-association.module').then(m => m.PeerJobAssociationModule)
      }
    ]
  },
  {
    path: '',
    component: AppNoWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'peer', pathMatch: 'full' },
      { path: 'peer', loadChildren: () => import('apps/legacy-content/app/_peer/peer.module').then(m => m.PeerModule) },
    ]
  },
  {
    path: '',
    component: AppNoWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'add-data', pathMatch: 'full' },
      { path: 'add-data', loadChildren: () => import('apps/legacy-content/app/_add-data/add-data.module').then(m => m.AddDataModule) },
      { path: 'add-jobs', loadChildren: () => import('apps/legacy-content/app/_add-jobs/add-jobs.module').then(m => m.AddJobsModule) },
      { path: 'multi-match', loadChildren: () => import('apps/legacy-content/app/_multi-match/multi-match-page.module').then(m => m.MultiMatchPageModule) }
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
