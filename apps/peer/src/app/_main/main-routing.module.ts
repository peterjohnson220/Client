import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeListPageComponent, ExchangeJobMappingPageComponent } from './containers/pages';
import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

const routes: Routes = [
  { path: '', redirectTo: 'exchanges', pathMatch: 'full' },
  { path: 'exchanges', component: ExchangeListPageComponent },
  { path: 'exchange/:id', component: ExchangeJobMappingPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
