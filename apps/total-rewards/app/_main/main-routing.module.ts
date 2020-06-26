import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./statement-list/statement-list.module').then(m => m.StatementListModule) },
  { path: 'statement/edit', loadChildren: () => import('./statement-edit/statement-edit.module').then(m => m.StatementEditModule) },
  { path: 'statement/edit/:id/assignments',
    loadChildren: () => import('./statement-assignment/statement-assignment.module').then(m => m.StatementAssignmentModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
