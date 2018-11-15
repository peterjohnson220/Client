import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';
import { AppNoWrapperComponent } from 'libs/features/app-root';

export const routes: Routes = [
  {
    path: '',
    component: AppNoWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'add-data', pathMatch: 'full' },
      { path: 'add-data', loadChildren: 'apps/project/app/_add-data/add-data.module#AddDataModule' },
      { path: 'add-jobs', loadChildren: 'apps/project/app/_add-jobs/add-jobs.module#AddJobsModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
