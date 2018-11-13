import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiMatchPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '', redirectTo: 'multi-match', pathMatch: 'full' },
  { path: 'multi-match', component: MultiMatchPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiMatchRoutingModule { }
