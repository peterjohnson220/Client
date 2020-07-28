import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { StatementPrintPageComponent } from './statement-print.page';

const routes: Routes = [
  { path: '', component: StatementPrintPageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementPrintRoutingModule { }
