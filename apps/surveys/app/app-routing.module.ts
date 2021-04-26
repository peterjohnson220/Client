import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/infrastructure/app-root';
import { UserContextGuard, TileEnabledGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard, TileEnabledGuard],
    children: [
      { path: '', loadChildren: () => import('apps/surveys/app/_surveys/surveys.module').then(m => m.SurveysModule) }
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
