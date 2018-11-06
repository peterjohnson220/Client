import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityJobActions from '../../actions/community-job.actions';

import { CommunityJob } from 'libs/models';


@Component({
  selector: 'pf-community-jobs',
  templateUrl: './community-jobs.component.html',
  styleUrls: ['./community-jobs.component.scss']
})
export class CommunityJobsComponent implements OnInit, OnDestroy {

  communityJobs$: Observable<CommunityJob[]>;
  loadingCommunityJobs$: Observable<boolean>;
  loadingCommunityJobsError$: Observable<boolean>;
  loadingMoreCommunityJobs$: Observable<boolean>;
  hasMoreResultsOnServer$: Observable<boolean>;
  hasMoreResultsOnServerSub: Subscription;
  loadingMoreCommunityJobsSub: Subscription;

  loadingMoreResults: boolean;
  hasMoreResultsOnServer: boolean;

   constructor(public store: Store<fromCommunityJobReducer.State>) {
      this.communityJobs$ = this.store.select(fromCommunityJobReducer.getCommunityJobs);
      this.loadingCommunityJobs$ = this.store.select(fromCommunityJobReducer.getGettingCommunityJobs);
      this.loadingMoreCommunityJobs$ = this.store.select(fromCommunityJobReducer.getLoadingMoreResults);
      this.hasMoreResultsOnServer$ = this.store.select(fromCommunityJobReducer.getHasMoreResultsOnServer);
      this.loadingCommunityJobsError$ = this.store.select(fromCommunityJobReducer.getGettingCommunityJobsError);
   }

  ngOnInit() {

    this.store.dispatch(new fromCommunityJobActions.GettingCommunityJobs());

    this.loadingMoreCommunityJobsSub = this.loadingMoreCommunityJobs$.subscribe(lmr =>
      this.loadingMoreResults = lmr
    );
    this.hasMoreResultsOnServerSub = this.hasMoreResultsOnServer$.subscribe(hmr =>
      this.hasMoreResultsOnServer = hmr
    );
  }

  ngOnDestroy() {
     if (!this.loadingMoreCommunityJobsSub) {
       this.loadingMoreCommunityJobsSub.unsubscribe();
     }
     if (!this.hasMoreResultsOnServerSub) {
       this.hasMoreResultsOnServerSub.unsubscribe();
     }
  }

  trackByJobId(item: CommunityJob) {
    return item.Id;
  }

  onScroll() {
    if (!this.loadingMoreResults && this.hasMoreResultsOnServer) {
      this.store.dispatch(new fromCommunityJobActions.GettingMoreCommunityJobs());
    }
  }

}
