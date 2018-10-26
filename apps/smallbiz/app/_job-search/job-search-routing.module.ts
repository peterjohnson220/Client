import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobSearchPageComponent, JobDetailPageComponent } from './containers';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    component: JobSearchPageComponent
  },
  {
    path: ':id',
    component: JobDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSearchRoutingModule { }
