import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayIntelligencePageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', component: PayIntelligencePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayIntelligenceRoutingModule { }
