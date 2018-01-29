import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayIntelligencePageComponent, TableauReportPageComponent } from './containers/pages';
import { NotFoundErrorPageComponent } from '../../../../../libs/ui/common/error/pages';

const routes: Routes = [
  { path: '', component: PayIntelligencePageComponent },
  { path: 'data-insights/:report', component: TableauReportPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayIntelligenceRoutingModule { }
