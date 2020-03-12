import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchResultsActions from '../../actions/search-results.actions';
import * as fromSearchReducer from '../../reducers';

@Component({
  selector: 'pf-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  @ViewChild('results', { static: true }) resultsContainer: ElementRef;
  @Input() numberOfCurrentResults: number;
  @Input() useSmallBizStyles: boolean;
  @Input() customSearchResultsStyle: any = {};

  // Observables
  loadingMoreResults$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  numberOfResultsOnServer$: Observable<number>;
  error$: Observable<boolean>;

  // Subscriptions
  loadingMoreResultsSub: Subscription;
  numberOfResultsOnServerSub: Subscription;
  loadingResultsSub: Subscription;
  loadingMoreResults: boolean;
  numberOfResultsOnServer: number;
  spinnerType = 'GIF';

  constructor(
    private store: Store<fromSearchReducer.State>
  ) {
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
    this.loadingMoreResults$ = this.store.select(fromSearchReducer.getLoadingMoreResults);
    this.numberOfResultsOnServer$ = this.store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.error$ = this.store.select(fromSearchReducer.getSearchResultsError);
  }

  // Events
  onScroll() {
    if (!this.loadingMoreResults && (this.numberOfResultsOnServer > this.numberOfCurrentResults)) {
      this.store.dispatch(new fromSearchResultsActions.GetMoreResults());
    }
  }

  // Lifecycle
  ngOnInit() {
    this.loadingMoreResultsSub = this.loadingMoreResults$.subscribe(lmr => this.loadingMoreResults = lmr);
    this.numberOfResultsOnServerSub = this.numberOfResultsOnServer$.subscribe(tr => this.numberOfResultsOnServer = tr);
    this.loadingResultsSub = this.loadingResults$.subscribe(lr => this.resetResultsContainer(lr));
  }

  ngOnDestroy() {
    this.loadingMoreResultsSub.unsubscribe();
    this.numberOfResultsOnServerSub.unsubscribe();
    this.loadingMoreResultsSub.unsubscribe();
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
