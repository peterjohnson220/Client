import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {StatementListPageComponent} from './statement-list/statement-list.page';
import {StatementEditPageComponent} from './statement-edit/statement-edit.page';

const routes: Routes = [
  {
    path: '', component: StatementListPageComponent
  },
  { path: 'statement/edit/:id', component: StatementEditPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
