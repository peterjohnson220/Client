import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';

import * as fromSearchPageActions from '../actions/search-page.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSharedSearchReducer from '../reducers';
import { SearchEffectsService } from '../services';

@Injectable()
export class SearchFiltersEffects {

  @Effect()
  updateStaticFilterValue$ = this.actions$
    .ofType(fromSearchFiltersActions.UPDATE_FILTER_VALUE)
    .pipe(
      map(() => new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }))
    );

  @Effect()
  updateRangeFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.UPDATE_RANGE_FILTER)
    .pipe(
      mergeMap(() => [
        new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }),
        new fromUserFilterActions.SetSelected({ selected: false })
      ])
    );

  @Effect()
  clearFilter$ = this.searchEffectsService.handleFilterRemoval(
    this.actions$.ofType(fromSearchFiltersActions.CLEAR_FILTER));


  @Effect()
  removeFilterValue$ = this.searchEffectsService.handleFilterRemoval(
    this.actions$.ofType(fromSearchFiltersActions.REMOVE_FILTER_VALUE));

  @Effect()
  toggleMultiSelectOption$ = this.actions$
    .ofType(fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION)
    .pipe(
      mergeMap(() => [
        new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }),
        new fromUserFilterActions.SetSelected({ selected: false })
      ])
    );

  @Effect()
  resetAllFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.RESET_ALL_FILTERS)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getSearchingFilter),
        (action: fromSearchFiltersActions.ResetAllFilters, searchingFilter) => ({ action, searchingFilter })
      ),
      mergeMap(data => {
          const actions = [];

          if (data.searchingFilter) {
            actions.push(new fromSearchPageActions.HideFilterSearch());
          }

          actions.push(new fromUserFilterActions.SetSelected({ selected: false }));
          actions.push(new fromUserFilterActions.ApplyDefault());

          return actions;
        }
      )
    );

  constructor(
    private actions$: Actions,
    private searchEffectsService: SearchEffectsService,
    private store: Store<fromSharedSearchReducer.State>
  ) {
  }
}
