import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeMapPageComponent } from './containers/pages';
import { ExchangeExistsGuard } from '../shared/guards';

const routes: Routes = [
  { path: '', component: ExchangeMapPageComponent, canActivate: [ExchangeExistsGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
