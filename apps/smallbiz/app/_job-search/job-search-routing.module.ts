import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobSearchPageComponent } from './containers/pages/job-search';

export const routes: Routes = [
  {
    path: '',
    component: JobSearchPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSearchRoutingModule { }
