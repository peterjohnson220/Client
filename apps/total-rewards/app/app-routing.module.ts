import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import { AuthorizationGuard, UserContextGuard } from 'libs/security';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  { path: '',
    canActivate: [UserContextGuard, AuthorizationGuard],
    component: AppWrapperComponent,
    loadChildren: () => import('./_main/main.module').then(m => m.MainModule)
  },
  { path: 'print', loadChildren: () => import('./_print/print.module').then(m => m.PrintModule) },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
