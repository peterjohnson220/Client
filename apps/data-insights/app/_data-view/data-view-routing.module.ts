import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataViewPageComponent } from './containers';

const routes: Routes = [
  {
    path: '',
    component: DataViewPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataViewRoutingModule {}
