import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppNamePageComponent } from './containers/pages';

const routes: Routes = [
  {
    path: '',
    component: AppNamePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
