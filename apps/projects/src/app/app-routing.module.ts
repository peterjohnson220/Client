import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security/index';
import { AppNoWrapperComponent } from 'libs/features/app-root';

export const routes: Routes = [
  {
    path: '',
    component: AppNoWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'peer', pathMatch: 'full' },
      { path: 'peer', loadChildren: 'apps/projects/src/app/_peer/peer.module#PeerModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
