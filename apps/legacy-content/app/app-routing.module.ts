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
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
