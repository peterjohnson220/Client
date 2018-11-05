import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddJobsPageComponent } from './containers';

const routes: Routes = [
  { path: '', redirectTo: 'add-jobs', pathMatch: 'full' },
  { path: 'add-jobs', component: AddJobsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddJobsRoutingModule { }
