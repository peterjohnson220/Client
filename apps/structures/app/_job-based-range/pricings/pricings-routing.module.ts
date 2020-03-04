import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PricingsPageComponent } from './pricings.page/pricings.page';

const routes: Routes = [
  {
    path: ':id',
    component: PricingsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingsRoutingModule { }
