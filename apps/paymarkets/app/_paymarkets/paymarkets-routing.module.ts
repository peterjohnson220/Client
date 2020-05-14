import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayMarketsPageComponent } from './paymarkets.page';

const routes: Routes = [
  {
    path: '',
    component: PayMarketsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayMarketsRoutingModule { }
