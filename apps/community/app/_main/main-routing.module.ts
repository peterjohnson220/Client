import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  CommunityDashboardPageComponent
} from './containers/pages';
import { CommunityJobPostingsPageComponent } from './containers/pages';
import { NewCommunityEnabledGuard } from 'libs/security';
import { CommunitySearchResultsPageComponent } from './containers/pages/community-search-results/community-search-results.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommunityEnabledGuard]
  },
  {
    path: 'dashboard/post/:id',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommunityEnabledGuard]
  },
  {
    path: 'dashboard/reply/:id',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommunityEnabledGuard]
  },
  {
    path: 'dashboard/tag/:id',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommunityEnabledGuard]
  },
  { path: 'job-postings',
    component: CommunityJobPostingsPageComponent,
    canActivate: [NewCommunityEnabledGuard]
  },
  { path: 'search-results',
    component: CommunitySearchResultsPageComponent,
    canActivate: [NewCommunityEnabledGuard]
  },
  { path: 'dashboard/topic/:id',
    component: CommunityDashboardPageComponent,
    canActivate: [NewCommunityEnabledGuard]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule {
}
