import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/infrastructure/app-root';
import { AuthorizationGuard, TileEnabledGuard, UserContextGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard, TileEnabledGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('apps/resources/app/_company-resources/main.module').then(m => m.MainModule),
        canActivate: [AuthorizationGuard],
        data: {Permissions: [Permissions.RESOURCES], Check: PermissionCheckEnum.Single}
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
