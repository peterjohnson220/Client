import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfAdminGuard } from 'libs/security';

import { MarketDataFeedPageComponent } from './market-data-feed.page';

const routes: Routes = [
  { path: '', component: MarketDataFeedPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketDataFeedPageRoutingModule {}
