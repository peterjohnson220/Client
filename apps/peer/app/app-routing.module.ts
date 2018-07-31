import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { UserContextGuard } from 'libs/security';
import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { AppWrapperComponent } from './shared/appwrapper/app-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      {
        path: 'exchange/:id',
        children: [
          {
            path: 'manage',
            loadChildren: 'apps/peer/app/_manage/manage.module#ManageModule'
          },
          {
            path: 'map',
            loadChildren: 'apps/peer/app/_map/map.module#MapModule'
          },
          {
            path: '',
            loadChildren: 'apps/peer/app/_dashboard/dashboard.module#DashboardModule'
          }
        ]
      },
      { path: 'exchanges', loadChildren: 'apps/peer/app/_dashboard/dashboard.module#DashboardModule' },
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
