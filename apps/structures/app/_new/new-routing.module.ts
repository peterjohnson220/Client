import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages/not-found-error';

import { RangeGroupExistsGuard } from './job-based-range';
import { JobBasedRangePageComponent } from './';

const routes: Routes = [
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: ':id', component: JobBasedRangePageComponent, canActivate: [RangeGroupExistsGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewRoutingModule { }
