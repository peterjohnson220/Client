import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompInfluencersPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: CompInfluencersPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompInfluencersRoutingModule { }
