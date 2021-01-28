import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/infrastructure/app-root';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { TileEnabledGuard, UserContextGuard, TabularReportBuilderGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';

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
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
