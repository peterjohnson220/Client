import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { UserContextGuard } from 'libs/security';

import { PeerPermissionsGuard } from './shared/guards';
import { AppWrapperComponent } from './shared/appwrapper/app-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      {
        path: 'exchange/:id',
        canActivate: [PeerPermissionsGuard],
        children: [
          { path: 'manage', loadChildren: () => import('apps/peer/app/_manage/manage.module').then(m => m.ManageModule) },
          { path: 'map', loadChildren: () => import('apps/peer/app/_map/map.module').then(m => m.MapModule) },
          { path: '', loadChildren: () => import('apps/peer/app/_dashboard/dashboard.module').then(m => m.DashboardModule) }
        ]
      },
      { path: 'exchanges', loadChildren: () => import('apps/peer/app/_dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'access-denied', component: AccessDeniedPageComponent },
      { path: 'exchange-not-found', component: NotFoundErrorPageComponent },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
