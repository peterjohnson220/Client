import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import {PfAdminGuard, UserContextGuard} from 'libs/security';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard, PfAdminGuard],
    children: [
      { path: '', loadChildren: () => import('apps/labs/app/_labs/labs-page.module').then(m => m.LabsPageModule) }
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
