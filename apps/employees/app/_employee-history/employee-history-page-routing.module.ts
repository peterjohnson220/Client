import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages/not-found-error';

import { EmployeeHistoryPageComponent } from './employee-history.page';
import { ValidDateGuard } from './guards/valid-date.guard';

const routes: Routes = [
  {
    path: ':date',
    component: EmployeeHistoryPageComponent,
    canActivate: [ValidDateGuard]
  },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeHistoryPageRoutingModule { }
