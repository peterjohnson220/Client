import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromInfiniteScrollActions from '../../actions/infinite-scroll.actions';
import * as fromInfiniteScrollReducer from '../../reducers';

@Component({
  selector: 'pf-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  @ViewChild('results', { static: true }) resultsContainer: ElementRef;
  @Input() numberOfCurrentResults: number;
  @Input() scrollId: string;

  // Observables
  loading$: Observable<boolean>;
  loadingMore$: Observable<boolean>;
  hasAllResults$: Observable<boolean>;
  error$: Observable<boolean>;

  // Subscriptions
  loadingSub: Subscription;
  loadingMoreSub: Subscription;
  hasAllResultsSub: Subscription;

  hasAllResults: boolean;
  loadingMore: boolean;
  spinnerType = 'GIF';

  constructor(private store: Store<fromInfiniteScrollReducer.State>) {}

  // Events
  onScroll() {
    if (!this.loadingMore && !this.hasAllResults) {
      this.store.dispatch(new fromInfiniteScrollActions.LoadMore({scrollId: this.scrollId}));
    }
  }

  // Lifecycle
  ngOnInit() {
    this.loading$ = this.store.select(fromInfiniteScrollReducer.getLoading, this.scrollId);
    this.loadingMore$ = this.store.select(fromInfiniteScrollReducer.getLoadingMore, this.scrollId);
    this.error$ = this.store.select(fromInfiniteScrollReducer.getError, this.scrollId);
    this.hasAllResults$ = this.store.select(fromInfiniteScrollReducer.getHasAllResults, this.scrollId);

    this.loadingMoreSub = this.loadingMore$.subscribe(lmr => this.loadingMore = lmr);
    this.loadingSub = this.loading$.subscribe(lr => this.resetResultsContainer(lr));
    this.hasAllResultsSub = this.hasAllResults$.subscribe(lrc => this.hasAllResults = lrc);
  }

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
    this.loadingMoreSub.unsubscribe();
    this.hasAllResultsSub.unsubscribe();
  }

  private resetResultsScrollToTop(loadingResults: boolean): void {
    const resultsContainerEl = this.resultsContainer.nativeElement;
    resultsContainerEl.scrollTop = !loadingResults ? 0 : resultsContainerEl.scrollTop;
  }

  private resetResultsContainer(loadingResults: boolean): void {
    if (!this.resultsContainer) {
      return;
    }
    this.resetResultsScrollToTop(loadingResults);
  }
}
