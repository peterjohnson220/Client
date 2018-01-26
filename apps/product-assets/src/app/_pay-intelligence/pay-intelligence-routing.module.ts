import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayIntelligencePageComponent, TableauReportPageComponent } from './containers/pages';
import { NotFoundErrorPageComponent } from '../../../../../libs/ui/common/error/pages';
import { ExchangeExistsGuard } from '../../../../admin/src/app/_peer/guards';
import {
  ExchangeListPageComponent,
  ManageExchangePageComponent
} from '../../../../admin/src/app/_peer/containers/pages';

const routes: Routes = [
  { path: '', component: PayIntelligencePageComponent },
  { path: 'data-insight', component: TableauReportPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayIntelligenceRoutingModule { }
