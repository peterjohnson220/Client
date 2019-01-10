import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  CommunityDashboardPageComponent
} from './containers/pages';
import { CommunityJobPostingsPageComponent } from './containers/pages';
import { NewCommninityEnabledGuard } from 'libs/security';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommninityEnabledGuard]
  },
  {
    path: 'dashboard/post/:id',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommninityEnabledGuard]
  },
  {
    path: 'dashboard/reply/:id',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommninityEnabledGuard]
  },
  {
    path: 'dashboard/tag/:id',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommninityEnabledGuard]
  },
  { path: 'job-postings',
    component: CommunityJobPostingsPageComponent,
    canActivate: [NewCommninityEnabledGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule {
}
