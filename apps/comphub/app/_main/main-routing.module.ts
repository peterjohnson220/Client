import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComphubPageComponent, JobsPageComponent, MarketsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: ComphubPageComponent },
  { path: 'jobs', component: JobsPageComponent },
  { path: 'markets', component: MarketsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
