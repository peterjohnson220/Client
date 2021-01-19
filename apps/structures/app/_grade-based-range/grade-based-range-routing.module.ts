import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RangeGroupExistsGuard } from '../shared/guards';


const routes: Routes = [
  { path: 'not-found', redirectTo: '/not-found' },
  {
    path: ':id',
    canActivate: [RangeGroupExistsGuard],
    data: { gradeBased: true },
    loadChildren: () => import('apps/structures/app/_grade-based-range/model/model.module').then(m => m.ModelModule)
  },
  {
    path: ':id/new',
    canActivate: [RangeGroupExistsGuard],
    data: { gradeBased: true },
    loadChildren: () => import('apps/structures/app/_grade-based-range/model/model.module').then(m => m.ModelModule)
  },
  {
    path: ':id/create-model',
    canActivate: [RangeGroupExistsGuard],
    data: { gradeBased: true },
    loadChildren: () => import('apps/structures/app/_grade-based-range/model/model.module').then(m => m.ModelModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeBasedRangeRoutingModule {}
