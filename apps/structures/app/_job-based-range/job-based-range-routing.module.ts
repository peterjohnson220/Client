import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RangeGroupExistsGuard } from '../shared/guards';

const routes: Routes = [
  { path: 'not-found', redirectTo: '/not-found' },
  { path: ':id',
    canActivate: [RangeGroupExistsGuard],
    loadChildren: () => import('apps/structures/app/_job-based-range/model/model.module').then(m => m.ModelModule)
  },
  { path: ':id/new',
    canActivate: [RangeGroupExistsGuard],
    loadChildren: () => import('apps/structures/app/_job-based-range/model/model.module').then(m => m.ModelModule)
  },
  { path: ':id/create-model',
    canActivate: [RangeGroupExistsGuard],
    loadChildren: () => import('apps/structures/app/_job-based-range/model/model.module').then(m => m.ModelModule)
  },
  { path: ':id/employees',
    canActivate: [RangeGroupExistsGuard],
    loadChildren: () => import('apps/structures/app/_job-based-range/employees/employees.module').then(m => m.EmployeesModule)
  },
  { path: ':id/pricings',
    canActivate: [RangeGroupExistsGuard],
    loadChildren: () => import('apps/structures/app/_job-based-range/pricings/pricings.module').then(m => m.PricingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobBasedRangeRoutingModule { }
