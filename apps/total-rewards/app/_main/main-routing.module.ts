import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalRewardsPageComponent } from './containers/pages';
import { EditTemplatePageComponent } from './containers/pages';

const routes: Routes = [
  {
    path: '',
    component: TotalRewardsPageComponent
  },
  {
    path: 'edit-template',
    component: EditTemplatePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
