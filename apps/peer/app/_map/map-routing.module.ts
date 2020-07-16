import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeMapPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: ExchangeMapPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
