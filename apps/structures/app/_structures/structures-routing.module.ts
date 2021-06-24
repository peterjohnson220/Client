import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructuresPageComponent } from './structures.page';

const routes: Routes = [
  {
    path: '',
    component: StructuresPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresRoutingModule { }
