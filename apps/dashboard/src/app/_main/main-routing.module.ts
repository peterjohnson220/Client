import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './containers/pages';
import { TimelinePanelComponent } from './containers/timeline-activity';
const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: '', component: TimelinePanelComponent, outlet: 'rightSidebarContent'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
