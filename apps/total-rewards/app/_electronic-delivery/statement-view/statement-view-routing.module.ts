import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { TileEnabledGuard } from 'libs/security/guards';

import { StatementViewPageComponent } from './statement-view.page';

const routes: Routes = [
  { path: ':statement_id/:employee_id', canActivate: [TileEnabledGuard], component: StatementViewPageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementViewRoutingModule { }
