import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobDescriptionListPageComponent } from './containers/pages';

const routes: Routes = [
  {
    path: '',
    component: JobDescriptionListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDescriptionRoutingModule { }
