import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickPricePageComponent } from './containers';

const routes: Routes = [
  { path: '', component: QuickPricePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
