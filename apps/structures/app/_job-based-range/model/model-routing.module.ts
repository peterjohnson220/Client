import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelPageComponent } from './model.page';

const routes: Routes = [
  {
    path: '',
    component: ModelPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelRoutingModule { }
