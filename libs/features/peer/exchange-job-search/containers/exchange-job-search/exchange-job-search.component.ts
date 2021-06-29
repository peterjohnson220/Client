import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SearchBaseDirective } from 'libs/features/search/search/containers/search-base';
import { UserContext } from 'libs/models/security';
import { FilterType, TextFilter } from 'libs/features/search/search/models';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromRootState from 'libs/state/state';

import * as fromExchangeJobSearchReducers from '../../reducers';
import * as fromExchangeJobSearchActions from '../../actions/exchange-job-search.actions';
import { SearchFilterMappingData, ExchangeJobSearchUserFilterType } from '../../models';

@Component({
  selector: 'pf-exchange-job-search',
  templateUrl: './exchange-job-search.component.html',
  styleUrls: ['./exchange-job-search.component.scss']
})
export class ExchangeJobSearchComponent extends SearchBaseDirective implements OnInit, OnDestroy {
  @Input() exchangeId$: Observable<number>;

  resultsLoading$: Observable<boolean>;
  moreResultsLoading$: Observable<boolean>;
  resultsLoadingError$: Observable<boolean>;
  numberOfResults$: Observable<number>;
  userContext$: Observable<UserContext>;
  searchingFilter$: Observable<boolean>;
  selectedExchangeJobCount$: Observable<number>;
  searchResultsCount$: Observable<number>;

  selectedExchangeJobCountSubscription = new Subscription();
  searchResultsCountSubscription = new Subscription();
  exchangeIdSubscription: Subscription;

  selectedExchangeJobCount: number;
  searchResultsCount: number;
  exchangeId: number;

  staticFilters: TextFilter[] = [
    {
      Id: 'peerHistoryTrendsOmniSearch',
      BackingField: 'peer_history_trends_omni_search',
      DisplayName: 'Job Title/Job Code/Exchange Job Id',
      Value: '',
      Type: FilterType.Text,
      Order: 1,
      CssClassName: 'peer_history_trends_omni_search'
    }
  ];

  constructor(store: Store<fromSearchReducer.State>) {
    super(store, SearchFilterMappingData, SearchFeatureIds.PeerExchangeJob, ExchangeJobSearchUserFilterType);
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.selectedExchangeJobCount$ = store.select(fromExchangeJobSearchReducers.getSelectedExchangeJobsCount);
    this.searchResultsCount$ = store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.resultsLoading$ = store.select(fromSearchReducer.getAmbiguousLoadingResults);
    this.moreResultsLoading$ = store.select(fromSearchReducer.getLoadingMoreResults);
    this.resultsLoadingError$ = store.select(fromSearchReducer.getSearchResultsError);
    this.numberOfResults$ = this.store.pipe(select(fromSearchReducer.getNumberOfResultsOnServer));
  }

  ngOnInit(): void {
    this.selectedExchangeJobCountSubscription = this.selectedExchangeJobCount$.subscribe(count => this.selectedExchangeJobCount = count);
    this.searchResultsCountSubscription = this.searchResultsCount$.subscribe(count => this.searchResultsCount = count);
    this.exchangeIdSubscription = this.exchangeId$.subscribe(exchangeId => {
      this.exchangeId = exchangeId;
      if (!!exchangeId) {
        this.initExchangeJobSearch();
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedExchangeJobCountSubscription.unsubscribe();
    this.searchResultsCountSubscription.unsubscribe();
    this.exchangeIdSubscription.unsubscribe();
  }

  initExchangeJobSearch(): void {
    if (!this.exchangeId) {
      return;
    }

    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {
            exchangeId: this.exchangeId
          }
        }
      }
    } as MessageEvent;
    this.onMessage(setContextMessage);
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromExchangeJobSearchActions.SetContext({exchangeId: payload.exchangeId}));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(this.staticFilters));
  }

  onResetApp(): void {
    this.store.dispatch(new fromExchangeJobSearchActions.ResetState());
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromExchangeJobSearchActions.ClearSelectedExchangeJobs());
    this.store.dispatch(new fromExchangeJobSearchActions.ClearExchangeJobResults());
  }

  onSubmitSelectedEmployees() {
    // this.store.dispatch(new fromExchangeJobSearchActions.AssignEmployees());
  }

  canAssignEmployees() {
    // return this.selectedEmployeesCount && !this.hasReachedEmployeesLimit;
    return true;
  }

  handleClearSelectedExchangeJobs(): void {
    this.store.dispatch(new fromExchangeJobSearchActions.ClearSelectedExchangeJobs());
  }

  handleAddAllEmployees(): void {
    // this.store.dispatch(new fromExchangeJobSearchActions.AssignAllEmployees({ assignmentMax: this.getAssignmentMaximum() }));
  }

  getPrimaryButtonText(): string {
    if (this.selectedExchangeJobCount) {
      return 'Assign (' + this.selectedExchangeJobCount + ')';
    }
    return 'Assign';
  }

  getAssignmentMaximum() {
    return this.searchResultsCount;
  }
}
