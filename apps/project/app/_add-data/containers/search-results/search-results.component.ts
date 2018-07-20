import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { JobResult, JobDetailsToolTipData } from '../../models';

import * as fromSearchResultsActions from '../../actions/search-results.actions';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  jobResults$: Observable<JobResult[]>;
  loadingMoreResults$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  loadingMoreResultsSub: Subscription;
  loadingMoreResults: boolean;
  tooltipData: JobDetailsToolTipData;
  showTooltip: boolean;
  tooltipIndex: number;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.jobResults$ = this.store.select(fromAddDataReducer.getResults);
    this.loadingResults$ = this.store.select(fromAddDataReducer.getLoadingResults);
    this.loadingMoreResults$ = this.store.select(fromAddDataReducer.getLoadingMoreResults);
  }

  // Events
  onScroll() {
    if (!this.loadingMoreResults) {
      this.store.dispatch(new fromSearchResultsActions.GetMoreResults());
    }
  }

  // Lifecycle
  ngOnInit() {
    this.loadingMoreResultsSub = this.loadingMoreResults$.subscribe(lmr => this.loadingMoreResults = lmr);
  }

  ngOnDestroy() {
    if (this.loadingMoreResultsSub) {
      this.loadingMoreResultsSub.unsubscribe();
    }
  }

  handleResultsScroll(): void {
    this.clearTooltip();
  }

  handleJobTitleClick(data: JobDetailsToolTipData, index: number): void {
    if (!!this.tooltipData && this.tooltipIndex === index) {
      this.clearTooltip();
      return;
    }
    this.tooltipData = data;
    this.tooltipIndex = index;
    this.showTooltip = true;
  }

  private clearTooltip(): void {
    this.showTooltip = false;
    this.tooltipIndex = -1;
  }
}
