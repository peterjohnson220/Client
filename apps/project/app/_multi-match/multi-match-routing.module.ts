import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MultiMatchPageComponent} from './multi-match-page/multi-match-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'multi-match', pathMatch: 'full' },
  { path: 'multi-match', component: MultiMatchPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiMatchRoutingModule { }
