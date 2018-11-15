import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { JobResult, MatchesDetailsTooltipData, ProjectSearchContext, DataCutDetails } from '../../models';
import { TooltipContainerComponent } from '../tooltip-container';
import * as fromSearchResultsActions from '../../actions/search-results.actions';
import * as fromAddDataReducer from '../../reducers';
import { hasMoreDataCuts } from '../../helpers';

@Component({
  selector: 'pf-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  @ViewChild('results') resultsContainer: ElementRef;
  @ViewChild('tooltipContainer') tooltipContainer: TooltipContainerComponent;
  @Input() cutsDraggable: boolean;

  // Observables
  jobResults$: Observable<JobResult[]>;
  loadingMoreResults$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  hasMoreResultsOnServer$: Observable<boolean>;
  projectSearchContext$: Observable<ProjectSearchContext>;
  error$: Observable<boolean>;

  // Subscriptions
  loadingMoreResultsSub: Subscription;
  hasMoreResultsOnServerSub: Subscription;
  loadingResultsSub: Subscription;
  loadingMoreResults: boolean;
  hasMoreResultsOnServer: boolean;
  spinnerType = 'GIF';

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.jobResults$ = this.store.select(fromAddDataReducer.getResults);
    this.loadingResults$ = this.store.select(fromAddDataReducer.getLoadingResults);
    this.loadingMoreResults$ = this.store.select(fromAddDataReducer.getLoadingMoreResults);
    this.hasMoreResultsOnServer$ = this.store.select(fromAddDataReducer.getHasMoreResultsOnServer);
    this.projectSearchContext$ = this.store.select(fromAddDataReducer.getProjectSearchContext);
    this.error$ = this.store.select(fromAddDataReducer.getSearchResultsError);
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
    this.loadingResultsSub = this.loadingResults$.subscribe(lr => this.resetResultsContainer(lr));
  }

  ngOnDestroy() {
    this.loadingMoreResultsSub.unsubscribe();
    this.hasMoreResultsOnServerSub.unsubscribe();
    this.loadingMoreResultsSub.unsubscribe();
  }

  handleLoadDataCuts(job: JobResult): void {
    if ((job.DataCuts.length && !hasMoreDataCuts(job)) || job.IsPayfactors) {
      return;
    }
    this.store.dispatch(new fromSearchResultsActions.GetSurveyDataResults(job));
  }

  handleCutSelectionToggle(data: DataCutDetails): void {
    this.store.dispatch(new fromSearchResultsActions.ToggleSurveyDataCutSelection(data));
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }

  handleMatchesMouseEnter(data: MatchesDetailsTooltipData): void {
    this.setResultsContainerSize();
    this.tooltipContainer.handleMatchesMouseEnter(data);
  }

  handleMatchesMouseLeave(): void {
    this.tooltipContainer.handleMatchesMouseLeave();
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

  private setResultsContainerSize(): void {
    if (!this.resultsContainer || (this.tooltipContainer.hasResultsContainerSize())) {
      return;
    }
    this.tooltipContainer.searchResultsContainerWidth = this.resultsContainer.nativeElement.offsetWidth;
    this.tooltipContainer.searchResultsContainerHeight = this.resultsContainer.nativeElement.offsetHeight;
  }

}
