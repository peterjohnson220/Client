import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataViewsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: DataViewsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
