import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesPageComponent } from './employees.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesPageRoutingModule { }
