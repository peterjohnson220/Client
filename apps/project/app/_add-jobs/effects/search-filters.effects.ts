import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';

import * as fromJobSearchResultsActions from '../actions/search-results.actions';

@Injectable()
export class SearchFiltersEffects {

  @Effect()
  resetAllFilters = this.actions$
    .ofType(fromSearchFiltersActions.RESET_ALL_FILTERS)
    .pipe(
      mergeMap(() =>
        [
          new fromSearchResultsActions.GetResults({keepFilteredOutOptions: false}),
          new fromJobSearchResultsActions.ClearSelectedJobs()
        ]
    ));

  constructor(
    private actions$: Actions
  ) {
  }
}
