import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComphubPageComponent, JobsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: ComphubPageComponent },
  { path: 'jobs', component: JobsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
