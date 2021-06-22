import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/infrastructure/app-root';
import { TileEnabledGuard, UserContextGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard, TileEnabledGuard],
    children: [
      { path: '', loadChildren: () => import('apps/comphub/app/_main/main.module').then(m => m.MainModule) }
    ]
  },
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: 'csd', loadChildren: () => import('apps/comphub/app/_crowd-sourced-data/crowd-sourced-data.module').then(m => m.CrowdSourcedDataModule) }
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
