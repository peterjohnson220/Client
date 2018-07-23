import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

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
  @ViewChild('results') resultsContainer: ElementRef;

  // Observables
  jobResults$: Observable<JobResult[]>;
  loadingMoreResults$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  hasMoreResultsOnServer$: Observable<boolean>;

  // Subscriptions
  loadingMoreResultsSub: Subscription;
  hasMoreResultsOnServerSub: Subscription;
  loadingResultsSub: Subscription;

  loadingMoreResults: boolean;
  tooltipData: JobDetailsToolTipData;
  showTooltip: boolean;
  tooltipIndex: number;
  hasMoreResultsOnServer: boolean;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.jobResults$ = this.store.select(fromAddDataReducer.getResults);
    this.loadingResults$ = this.store.select(fromAddDataReducer.getLoadingResults);
    this.loadingMoreResults$ = this.store.select(fromAddDataReducer.getLoadingMoreResults);
    this.hasMoreResultsOnServer$ = this.store.select(fromAddDataReducer.getHasMoreResultsOnServer);
  }

  // Events
  onScroll() {
    if (!this.loadingMoreResults && this.hasMoreResultsOnServer) {
      this.store.dispatch(new fromSearchResultsActions.GetMoreResults());
    }
  }

  // Lifecycle
  ngOnInit() {
    this.loadingMoreResultsSub = this.loadingMoreResults$.subscribe(lmr => this.loadingMoreResults = lmr);
    this.hasMoreResultsOnServerSub = this.hasMoreResultsOnServer$.subscribe(hmr => this.hasMoreResultsOnServer = hmr);
    this.loadingResultsSub = this.loadingResults$.subscribe(lr => this.resetResultsScrollToTop(lr));
  }

  ngOnDestroy() {
    this.loadingMoreResultsSub.unsubscribe();
    this.hasMoreResultsOnServerSub.unsubscribe();
    this.loadingMoreResultsSub.unsubscribe();
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

  private resetResultsScrollToTop(loadingResults: boolean): void {
    if (!this.resultsContainer) {
      return;
    }

    const resultsContainerEl = this.resultsContainer.nativeElement;
    resultsContainerEl.scrollTop = !loadingResults ? 0 : resultsContainerEl.scrollTop;
  }
}
