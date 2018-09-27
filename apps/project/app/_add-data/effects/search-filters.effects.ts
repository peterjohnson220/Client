import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, concatMap, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
import { SearchFilter, SaveSearchFiltersRequest } from 'libs/models';

import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromAddDataReducer from '../reducers';
import { getSelectedSearchFilters } from '../helpers';

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
      map(() => new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }))
    );

  @Effect()
  resetFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.CLEAR_FILTER)
    .pipe(
      map(() => new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }))
    );

  @Effect()
  removeFilterValue$ = this.actions$
    .ofType(fromSearchFiltersActions.REMOVE_FILTER_VALUE)
    .pipe(
      map(() => new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }))
    );

  @Effect()
  resetAllFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.RESET_ALL_FILTERS)
    .pipe(
      map(() => new fromSearchFiltersActions.GetSavedFilters())
    );

  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER)
    .pipe(
      withLatestFrom(this.store.select(fromAddDataReducer.getProjectSearchContext), (action, projectSearchContext) => projectSearchContext),
      switchMap((projectSearchContext) => {
          return this.surveySearchApiService.getDefaultSurveyScopesFilter(projectSearchContext.PayMarketId)
            .pipe(
              concatMap(response => [
                new fromSearchFiltersActions.GetDefaultScopesFilterSuccess(response),
                new fromSearchFiltersActions.GetSavedFilters()
              ]
            )
            );
        }
      )
    );

  @Effect()
  toggleMultiSelectOption$ = this.actions$
    .ofType(fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION)
    .pipe(
      map(() => new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }))
    );

  @Effect()
  saveSearchFilters$ = this.actions$
    .ofType(fromSearchFiltersActions.SAVE_SEARCH_FILTERS)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getProjectSearchContext),
        this.store.select(fromAddDataReducer.getFilters),
        (action: fromSearchFiltersActions.SaveSearchFilters, projectSearchContext, filters) => ({action, projectSearchContext, filters})),
      switchMap(({action, projectSearchContext, filters}) => {
        const selectedFilters: SearchFilter[] = getSelectedSearchFilters(filters);
        const request: SaveSearchFiltersRequest = {
          PayMarketId: action.payload.isForAllPayMarkets ? -1 : projectSearchContext.PayMarketId,
          Filters: selectedFilters
        };
        return this.surveySearchApiService.saveSearchFilters(request)
          .pipe(
            map(() => new fromSearchFiltersActions.SaveSearchFiltersSuccess())
          );
      })
    );

  @Effect()
  getSavedFilters$ = this.actions$
    .ofType(fromSearchFiltersActions.GET_SAVED_FILTERS)
    .pipe(
      withLatestFrom(this.store.select(fromAddDataReducer.getProjectSearchContext), (action, projectSearchContext) => projectSearchContext),
      switchMap((projectSearchContext) => {
        return this.surveySearchApiService.getSavedFilters(projectSearchContext.PayMarketId)
          .pipe(
            concatMap(response => [
              new fromSearchFiltersActions.GetSavedFiltersSuccess(response),
              new fromSearchResultsActions.GetResults({
                keepFilteredOutOptions: false,
                savedFilters: response
              })
            ]),
            catchError(() => of(new fromSearchResultsActions.GetResults({
              keepFilteredOutOptions: false
            })))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private surveySearchApiService: SurveySearchApiService,
    private store: Store<fromAddDataReducer.State>
  ) {
  }
}
