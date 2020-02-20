import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
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
    .pipe(
      ofType(fromSearchFiltersActions.UPDATE_FILTER_VALUE),
      map(() => new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }))
    );

  @Effect()
  updateRangeFilter$ = this.actions$
    .pipe(
      ofType(fromSearchFiltersActions.UPDATE_RANGE_FILTER),
      mergeMap(() => [
        new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }),
        new fromUserFilterActions.SetSelected({ selected: false })
      ])
    );

  @Effect()
  clearFilter$ = this.searchEffectsService.handleFilterRemoval(
    this.actions$.pipe(ofType(fromSearchFiltersActions.CLEAR_FILTER)));

  @Effect()
  clearFilters$ = this.searchEffectsService.handleFilterRemoval(
    this.actions$.pipe(ofType(fromSearchFiltersActions.CLEAR_FILTERS)));

  @Effect()
  removeFilterValue$ = this.searchEffectsService.handleFilterRemoval(
    this.actions$.pipe(ofType(fromSearchFiltersActions.REMOVE_FILTER_VALUE)));

  @Effect()
  toggleMultiSelectOption$ = this.actions$
    .pipe(
      ofType(fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION),
      mergeMap(() => [
        new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }),
        new fromUserFilterActions.SetSelected({ selected: false })
      ])
    );

  @Effect()
  resetAllFilter$ = this.actions$
    .pipe(
      ofType(fromSearchFiltersActions.RESET_ALL_FILTERS),
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getSearchingFilter),
        this.store.select(fromSharedSearchReducer.getSearchingChildFilter),
        (action: fromSearchFiltersActions.ResetAllFilters, searchingFilter, searchingChildFilter) => ({ action, searchingFilter, searchingChildFilter })
      ),
      mergeMap(data => {
          const actions = [];

          if (data.searchingFilter) {
            actions.push(new fromSearchPageActions.HideFilterSearch());
          }
          if (data.searchingChildFilter) {
            actions.push(new fromSearchPageActions.HideChildFilterSearch());
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
