import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobDetailPageComponent } from './containers/pages/job-detail/job-detail.page';

export const routes: Routes = [
  {
    path: ':id',
    component: JobDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class JobDetailRoutingModule { }
