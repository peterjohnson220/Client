import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { StatementAssignmentPageComponent } from './statement-assignment.page';

const routes: Routes = [
  { path: '', component: StatementAssignmentPageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementAssignmentRoutingModule { }
