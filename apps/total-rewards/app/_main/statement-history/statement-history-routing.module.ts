import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatementHistoryPageComponent } from './statement-history.page';

const routes: Routes = [
  { path: '', component: StatementHistoryPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementHistoryRoutingModule { }
