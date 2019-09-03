import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppWrapperComponent} from 'libs/features/app-root';
import { UserContextGuard } from 'libs/security';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'company-jobs', pathMatch: 'full' },
      { path: 'company-jobs', loadChildren: () => import('apps/jobs/app/_jobs-page/jobs-page.module').then(m => m.JobsPageModule)}
    ]
  },
  { path: 'matches-modal', loadChildren: () => import('apps/jobs/app/_matches-modal/matches-modal.module')
      .then(m => m.MatchesModalModule) },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
