import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataInsightsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: DataInsightsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
