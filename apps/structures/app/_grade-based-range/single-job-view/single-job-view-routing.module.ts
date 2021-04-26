import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SingleJobViewPageComponent } from './single-job-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: SingleJobViewPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleJobViewRoutingModule {}
