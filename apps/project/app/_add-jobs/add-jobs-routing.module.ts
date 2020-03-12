import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddJobsPageComponent } from 'libs/features/add-jobs/containers/pages/add-jobs';

import { CreateNewJobPageComponent } from './containers';

const routes: Routes = [
  { path: '', redirectTo: 'add-jobs', pathMatch: 'full' },
  { path: 'add-jobs', component: AddJobsPageComponent, data: { key: 'add-jobs'} },
  { path: 'create-new-job', component: CreateNewJobPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddJobsRoutingModule { }



