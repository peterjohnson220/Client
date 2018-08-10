import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfAdminGuard } from 'libs/security/guards';

import { CommunityPollsComponent } from './containers/community-polls/community-polls.component';


const routes: Routes = [
  { path: 'community-polls', component: CommunityPollsComponent, canActivate: [PfAdminGuard] },
  { path: '', redirectTo: 'community-polls', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
