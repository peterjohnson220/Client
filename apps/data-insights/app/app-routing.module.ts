import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { TileEnabledGuard, UserContextGuard, TabularReportBuilderGuard } from 'libs/security';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard, TileEnabledGuard],
    children: [
      { path: '', loadChildren: () => import('apps/data-insights/app/_main/main.module').then(m => m.MainModule) },
      {
        path: 'custom-report/:dataViewId',
        loadChildren: () => import('apps/data-insights/app/_data-view/data-view.module').then(m => m.DataViewModule),
        canActivate: [TabularReportBuilderGuard],
        data: {Permissions: [Permissions.TABULAR_REPORT_BUILDER], Check: PermissionCheckEnum.Single}
      }
    ]
  },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
