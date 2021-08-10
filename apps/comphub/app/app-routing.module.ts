import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/infrastructure/app-root';
import { TileEnabledGuard, UserContextGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: 'csd', loadChildren: () => import('apps/comphub/app/_crowd-sourced-data/crowd-sourced-data.module').then(m => m.CrowdSourcedDataModule) },
      { path: 'trends', loadChildren: () => import('apps/comphub/app/_peer-trends-data/peer-trends-data.module').then(m => m.PeerTrendsDataModule) },

      {
        path: '',
        canActivate: [TileEnabledGuard],
        loadChildren: () => import('apps/comphub/app/_main/main.module').then(m => m.MainModule)
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
