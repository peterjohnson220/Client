import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityPollsComponent } from './containers/community-polls/community-polls.component';

const routes: Routes = [
  { path: 'community-polls', component: CommunityPollsComponent },
  { path: '', redirectTo: 'community-polls', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
