import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalRewardsTemplatePageComponent } from './containers/pages';

const routes: Routes = [
  {
    path: '',
    component: TotalRewardsTemplatePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule { }
