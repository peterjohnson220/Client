import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromPayMarketActions from 'libs/features/add-jobs/actions/paymarkets.actions';
import * as fromJobSearchResultsActions from 'libs/features/add-jobs/actions/search-results.actions';

@Injectable()
export class SearchFiltersEffects {

  @Effect()
  resetAllFilters = this.actions$
    .pipe(
      ofType(fromSearchFiltersActions.RESET_ALL_FILTERS),
      mergeMap(() =>
        [
          new fromSearchResultsActions.GetResults({keepFilteredOutOptions: false}),
          new fromJobSearchResultsActions.ClearSelectedJobs(),
          new fromPayMarketActions.ResetPayMarketSelections(),
          new fromPayMarketActions.SetSearchTerm('')
        ]
    ));

  constructor(
    private actions$: Actions
  ) {
  }
}
