import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromPayMarketActions from 'libs/features/jobs/add-jobs/actions/paymarkets.actions';
import * as fromJobSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';


@Injectable()
export class SearchFiltersEffects {

  @Effect()
  resetAllFilters = this.actions$
    .pipe(
      ofType(fromSearchFiltersActions.RESET_ALL_FILTERS),
      withLatestFrom(
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (action: fromSearchFiltersActions.ResetAllFilters, searchFeatureId) => ({ action, searchFeatureId })),
      filter((data) => data.searchFeatureId === SearchFeatureIds.AddJobs),
      mergeMap(() =>
        [
          new fromSearchResultsActions.GetResults({keepFilteredOutOptions: false}),
          new fromJobSearchResultsActions.ClearSelectedJobs(),
          new fromPayMarketActions.ResetPayMarketSelections(),
          new fromPayMarketActions.SetSearchTerm('')
        ]
    ));

  constructor(
    private actions$: Actions,
    private store: Store<any>
  ) {
  }
}
