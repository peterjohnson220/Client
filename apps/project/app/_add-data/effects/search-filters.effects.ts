import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSearchActions from '../actions/search.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromResultsHeaderActions from '../actions/results-header.actions';
import * as fromAddDataReducer from '../reducers';
import { AddDataEffectsService } from '../services';

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
        new fromResultsHeaderActions.UnselectSavedFilter()
      ])
    );

  @Effect()
  clearFilter$ = this.addDataEffectsService.handleFilterRemoval(
    this.actions$.ofType(fromSearchFiltersActions.CLEAR_FILTER));


  @Effect()
  removeFilterValue$ = this.addDataEffectsService.handleFilterRemoval(
    this.actions$.ofType(fromSearchFiltersActions.REMOVE_FILTER_VALUE));

  @Effect()
  toggleMultiSelectOption$ = this.actions$
    .ofType(fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION)
    .pipe(
      mergeMap(() => [
        new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }),
        new fromResultsHeaderActions.UnselectSavedFilter()
      ])
    );

  @Effect()
  resetAllFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.RESET_ALL_FILTERS)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getSearchingFilter),
        (action: fromSearchFiltersActions.ResetAllFilters, searchingFilter) => ({ action, searchingFilter })
      ),
      mergeMap(data => {
          const actions = [];

          if (data.searchingFilter) {
            actions.push(new fromSearchActions.HideFilterSearch());
          }

          actions.push(new fromResultsHeaderActions.UnselectSavedFilter());
          actions.push(new fromResultsHeaderActions.ApplyDefaultSavedFilter());

          return actions;
        }
      )
    );

  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER)
    .pipe(
      withLatestFrom(this.store.select(fromAddDataReducer.getProjectSearchContext), (action, projectSearchContext) => projectSearchContext),
      switchMap((projectSearchContext) => {
          return this.surveySearchApiService.getDefaultSurveyScopesFilter(projectSearchContext.PayMarketId)
            .pipe(
              map(response => new fromSearchFiltersActions.GetDefaultScopesFilterSuccess(response))
            );
        }
      )
    );

  @Effect()
  getDefaultSurveyScopesFilterSuccess$ = this.actions$
    .ofType(fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS)
    .pipe(
      map(() => new fromResultsHeaderActions.InitSavedFilters())
    );


  constructor(
    private actions$: Actions,
    private surveySearchApiService: SurveySearchApiService,
    private addDataEffectsService: AddDataEffectsService,
    private store: Store<fromAddDataReducer.State>
  ) {
  }
}
