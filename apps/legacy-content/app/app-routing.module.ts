import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeerTileEnabledGuard, UserContextGuard } from 'libs/security';
import { AppNoWrapperComponent } from 'libs/features/app-root';
import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  {
    path: '',
    component: AppNoWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'peer', pathMatch: 'full' },
      { path: 'peer', loadChildren: 'apps/legacy-content/app/_peer/peer.module#PeerModule' },
      {
        path: 'peer-job-association',
        canActivate: [PeerTileEnabledGuard],
        loadChildren:
            'apps/legacy-content/app/_peer-job-association/peer-job-association.module#PeerJobAssociationModule'
      },
      { path: 'access-denied', component: AccessDeniedPageComponent },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
