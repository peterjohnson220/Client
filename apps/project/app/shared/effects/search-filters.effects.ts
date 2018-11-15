import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSearchActions from '../actions/search.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSavedFiltersActions from '../actions/saved-filters.actions';
import * as fromSharedSearchReducer from '../reducers';
import { SurveySearchEffectsService } from '../services';

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
        new fromSavedFiltersActions.UnselectSavedFilter()
      ])
    );

  @Effect()
  clearFilter$ = this.surveySearchEffectsService.handleFilterRemoval(
    this.actions$.ofType(fromSearchFiltersActions.CLEAR_FILTER));


  @Effect()
  removeFilterValue$ = this.surveySearchEffectsService.handleFilterRemoval(
    this.actions$.ofType(fromSearchFiltersActions.REMOVE_FILTER_VALUE));

  @Effect()
  toggleMultiSelectOption$ = this.actions$
    .ofType(fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION)
    .pipe(
      mergeMap(() => [
        new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }),
        new fromSavedFiltersActions.UnselectSavedFilter()
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
            actions.push(new fromSearchActions.HideFilterSearch());
          }

          actions.push(new fromSavedFiltersActions.UnselectSavedFilter());
          actions.push(new fromSavedFiltersActions.ApplyDefaultSavedFilter());

          return actions;
        }
      )
    );

  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER)
    .pipe(
      withLatestFrom(this.store.select(fromSharedSearchReducer.getProjectSearchContext),
        (action, projectSearchContext) => projectSearchContext),
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
      map(() => new fromSavedFiltersActions.InitSavedFilters())
    );


  constructor(
    private actions$: Actions,
    private surveySearchApiService: SurveySearchApiService,
    private surveySearchEffectsService: SurveySearchEffectsService,
    private store: Store<fromSharedSearchReducer.State>
  ) {
  }
}
