import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import { SearchBase } from 'libs/features/search/containers/search-base';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromAddJobsPageActions from '../../../actions/add-jobs.page.actions';
import * as fromAddJobsSearchResultsActions from '../../../actions/search-results.actions';
import * as fromPaymarketActions from '../../../actions/paymarkets.actions';
import * as fromAddJobsReducer from '../../../reducers';

import { staticFilters } from '../../../data';

@Component({
  selector: 'pf-add-jobs-page',
  templateUrl: './add-jobs.page.html',
  styleUrls: ['./add-jobs.page.scss']
})
export class AddJobsPageComponent extends SearchBase {
  selectedJobIds$: Observable<string[]>;
  selectedPayfactorsJobCodes$: Observable<string[]>;
  searchingFilter$: Observable<boolean>;
  numberOfResults$: Observable<number>;
  selectedPaymarkets$: Observable<number[]>;
  pageShown$: Observable<boolean>;
  addingData$: Observable<boolean>;

  constructor(
    store: Store<fromSearchReducer.State>,
  ) {
    super(store);
    this.selectedJobIds$ = this.store.select(fromAddJobsReducer.getSelectedJobIds);
    this.selectedPayfactorsJobCodes$ = this.store.select(fromAddJobsReducer.getSelectedPayfactorsJobCodes);
    this.searchingFilter$ = this.store.select(fromSearchReducer.getSearchingFilter);
    this.numberOfResults$ = this.store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.selectedPaymarkets$ = this.store.select(fromAddJobsReducer.getSelectedPaymarkets);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.addingData$ = this.store.select(fromAddJobsReducer.getAddingData);
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromAddJobsPageActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));
    this.store.dispatch(new fromPaymarketActions.SetDefaultPaymarket(Number(payload.PayMarketId)));
    this.store.dispatch(new fromPaymarketActions.LoadPaymarkets());
  }

  onResetApp(): void {
    this.store.dispatch(new fromPaymarketActions.ResetPaymarkets());
    this.store.dispatch(new fromAddJobsSearchResultsActions.ClearSelectedJobs());
  }

  handleAddClicked(): void {
    this.store.dispatch(new fromAddJobsPageActions.AddSelectedJobs());
  }
}
