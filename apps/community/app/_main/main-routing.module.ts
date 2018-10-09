import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  CommunityDashboardPageComponent
} from './containers/pages';
import { CommunityJobPostingsPageComponent } from './containers/pages';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard',
    component: CommunityDashboardPageComponent
  },
  { path: 'job-postings',
    component: CommunityJobPostingsPageComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule {
}
