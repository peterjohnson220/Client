import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatementEditPageComponent } from './statement-edit.page';

const routes: Routes = [
  { path: ':id', component: StatementEditPageComponent },
  { path: 'clone/:templateId',  component: StatementEditPageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementEditRoutingModule { }
