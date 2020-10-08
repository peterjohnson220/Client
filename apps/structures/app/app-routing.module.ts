import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import { UserContextGuard } from 'libs/security';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent, ServerErrorPageComponent, ForbiddenPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: 'server-error', component: ServerErrorPageComponent },
  { path: 'forbidden', component: ForbiddenPageComponent },
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', loadChildren: () => import('apps/structures/app/_job-based-range/job-based-range.module').then(m => m.JobBasedRangeModule) }
    ]
  },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
