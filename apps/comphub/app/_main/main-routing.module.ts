import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComphubPageComponent } from './containers/pages';

const routes: Routes = [
  {
    path: '',
    component: ComphubPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
