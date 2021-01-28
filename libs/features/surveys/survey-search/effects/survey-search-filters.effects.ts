import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';
import {SurveySearchApiService} from 'libs/data/payfactors-api/search';
import {PayfactorsSearchApiModelMapper} from 'libs/features/search/search/helpers';
import {MultiSelectFilter} from 'libs/features/search/search/models';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';

import * as fromSurveySearchFiltersActions from '../actions/survey-search-filters.actions';
import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import * as fromSurveySearchReducer from '../reducers';

@Injectable()
export class SurveySearchFiltersEffects {

  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .pipe(
      ofType(fromSurveySearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER),
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        this.store.select(fromSearchReducer.getSearchFilterMappingData),
        (action, context, searchFilterMappingDataObj) => ({context, searchFilterMappingDataObj})),
      switchMap((obj) => {
        const paymarketId = obj.context.PaymarketId;
          return this.surveySearchApiService.getDefaultSurveyScopesFilter(paymarketId)
            .pipe(
              mergeMap(response => [
                new fromSurveySearchFiltersActions.GetDefaultScopesFilterSuccess(),
                new fromSearchFiltersActions.AddFilterAndSelectAllOptions(
                  <MultiSelectFilter>this.payfactorsSearchApiModelMapper.mapSearchFilterToFilter(response, obj.searchFilterMappingDataObj))
              ])
            );
        }
      )
    );

  @Effect()
  getDefaultSurveyScopesFilterSuccess$ = this.actions$
    .pipe(
      ofType(fromSurveySearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS),
      map(() => new fromUserFilterActions.Init())
    );

  @Effect()
  resetAllFilters$ = this.actions$
    .pipe(
      ofType(fromSearchFiltersActions.RESET_ALL_FILTERS),
      withLatestFrom(
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (action: fromSearchFiltersActions.ResetAllFilters, searchFeatureId) => ({ action, searchFeatureId })),
      filter((data) => data.searchFeatureId === SearchFeatureIds.AddSurveyData || data.searchFeatureId === SearchFeatureIds.MultiMatch),
      map(() => new fromSurveySearchResultsActions.ClearDataCutSelections())
    );

  constructor(
    private actions$: Actions,
    private surveySearchApiService: SurveySearchApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private store: Store<fromSurveySearchReducer.State>
  ) {
  }
}
