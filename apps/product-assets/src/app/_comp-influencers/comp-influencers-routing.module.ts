import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductAssetsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: ProductAssetsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompInfluencersRoutingModule { }
