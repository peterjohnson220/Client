import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { PeerTileEnabledGuard, UserContextGuard } from 'libs/security';

import { ExchangeExistsGuard, PeerPermissionsGuard } from './shared/guards';
import { AppWrapperComponent } from './shared/appwrapper/app-wrapper.component';
import { RedirectToExchangeComponent } from './shared/containers/redirect-to-exchange';
import { NoExchangesPageComponent } from './shared/containers/pages/no-exchanges';
import { DEFAULT_ROUTES } from 'libs/ui/common';

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
          {
            path: '',
            canActivate: [PeerTileEnabledGuard],
            children: [
              { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
              {
                path: 'dashboard',
                loadChildren: () => import('apps/peer/app/_dashboard/dashboard.module').then(m => m.DashboardModule),
                canActivate: [ExchangeExistsGuard]
              },
              {
                path: 'manage',
                loadChildren: () => import('apps/peer/app/_manage/manage.module').then(m => m.ManageModule),
                canActivate: [ExchangeExistsGuard]
              },
              {
                path: 'map',
                loadChildren: () => import('apps/peer/app/_map/map.module').then(m => m.MapModule),
                canActivate: [ExchangeExistsGuard]
              }
            ]
          }
        ]
      },
      {
        path: 'exchanges',
        children: [
          {
            path: 'redirect',
            component: RedirectToExchangeComponent
          },
          {
            path: 'no-exchanges',
            component: NoExchangesPageComponent
          },
          { path: '**', redirectTo: '/not-found' }
        ]
      },
      { path: 'access-denied', redirectTo: '/access-denied' },
      { path: 'exchange-not-found', redirectTo: '/not-found' },
      { path: '**', redirectTo: '/not-found' }
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
