import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromAddJobsReducer from '../../reducers';
import * as fromSearchResultsActions from '../../actions/search-results.actions';
import { JobResult } from '../../models';

@Component({
  selector: 'pf-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  jobResults$: Observable<JobResult[]>;
  hasMoreResultsOnServer$: Observable<boolean>;
  loadingMoreResults$: Observable<boolean>;

  hasMoreResultsOnServerSub: Subscription;

  hasMoreResultsOnServer: boolean;
  spinnerType = 'GIF';

  constructor(private store: Store<fromAddJobsReducer.State>) {
    this.jobResults$ = this.store.select(fromAddJobsReducer.getJobs);
    this.hasMoreResultsOnServer$ = this.store.select(fromAddJobsReducer.getHasMoreResultsOnServer);
    this.loadingMoreResults$ = this.store.select(fromAddJobsReducer.getLoadingMoreResults);
  }

  ngOnInit(): void {
    this.hasMoreResultsOnServerSub = this.hasMoreResultsOnServer$.subscribe(hmr => this.hasMoreResultsOnServer = hmr);
  }

  ngOnDestroy(): void {
    this.hasMoreResultsOnServerSub.unsubscribe();
  }

  onScroll(): void {
    if (this.hasMoreResultsOnServer) {
      this.store.dispatch(new fromSearchResultsActions.GetMoreResults());
    }
  }

  handleJobSelectionToggle(job: JobResult): void {
    this.store.dispatch(new fromSearchResultsActions.ToggleJobSelection(job));
  }
}
