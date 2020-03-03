import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages/not-found-error';

import { RangeGroupExistsGuard } from './model';

const routes: Routes = [
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: ':id',
    canActivate: [RangeGroupExistsGuard],
    loadChildren: () => import('apps/structures/app/_job-based-range/model/model.module').then(m => m.ModelModule)
  },
  { path: ':id/employees',
    canActivate: [RangeGroupExistsGuard],
    loadChildren: () => import('apps/structures/app/_job-based-range/employees/employees.module').then(m => m.EmployeesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobBasedRangeRoutingModule { }