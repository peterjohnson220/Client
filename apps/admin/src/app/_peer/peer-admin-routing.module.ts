import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

import { ExchangeListPageComponent, ManageExchangePageComponent } from './containers/pages';
import { ExchangeExistsGuard } from './guards';

const routes: Routes = [
  { path: '', redirectTo: 'exchanges', pathMatch: 'full' },
  { path: 'exchanges', component: ExchangeListPageComponent },
  { path: 'exchange/:id', component: ManageExchangePageComponent, canActivate: [ExchangeExistsGuard] },
  { path: 'exchange-not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerAdminRoutingModule { }
