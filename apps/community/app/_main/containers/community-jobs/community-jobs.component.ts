import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityJobActions from '../../actions/community-job.actions';

import { CommunityJob } from 'libs/models';

@Component({
  selector: 'pf-community-jobs',
  templateUrl: './community-jobs.component.html',
  styleUrls: ['./community-jobs.component.scss']
})
export class CommunityJobsComponent implements OnInit {
  communityJobs$: Observable<CommunityJob[]>;

   constructor(public store: Store<fromCommunityJobReducer.State>) {
    this.communityJobs$ = this.store.select(fromCommunityJobReducer.getCommunityJobs);
   }

  ngOnInit() {
    this.store.dispatch(new fromCommunityJobActions.GettingCommunityJobs());
  }

  trackByJobId(item: CommunityJob) {
    return item.Id;
  }
}
