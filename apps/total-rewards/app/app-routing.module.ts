import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import { TileEnabledGuard, UserContextGuard } from 'libs/security';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  { path: 'print/:pdfId', loadChildren: () => import('./_print/print.module').then(m => m.PrintModule) },
  { path: '',
    canActivate: [UserContextGuard, TileEnabledGuard],
    component: AppWrapperComponent,
    loadChildren: () => import('./_main/main.module').then(m => m.MainModule)
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
