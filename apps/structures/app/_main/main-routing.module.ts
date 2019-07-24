import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobRangeModelingPageComponent } from './containers/pages/job-range-modeling';
import { JobBasedRangeStructuresPageComponent } from './containers/pages/job-based-range-structures';

const routes: Routes = [
  // todo: remove redirect when structures landing page introduced
  { path: '', redirectTo: 'job-range-modeling', pathMatch: 'full' },
  { path: 'job-range-modeling/:id', component: JobRangeModelingPageComponent },
  { path: 'job-range-modeling', component: JobRangeModelingPageComponent },
  { path: 'job-based-range-structures', component: JobBasedRangeStructuresPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
