import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StatementListPageComponent} from './statement-list.page';

const routes: Routes = [
  { path: '', component: StatementListPageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementListRoutingModule { }
