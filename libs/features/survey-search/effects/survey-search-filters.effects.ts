import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import {SurveySearchApiService} from 'libs/data/payfactors-api/search';
import {PayfactorsSearchApiModelMapper} from 'libs/features/search/helpers';
import {MultiSelectFilter} from 'libs/features/search/models';

import * as fromSurveySearchFiltersActions from '../actions/survey-search-filters.actions';
import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import * as fromSurveySearchReducer from '../reducers';

@Injectable()
export class SurveySearchFiltersEffects {

  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .pipe(
      ofType(fromSurveySearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER),
      withLatestFrom(this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        (action, context) => ({context})),
      switchMap((obj) => {
        const paymarketId = obj.context.PaymarketId;
          return this.surveySearchApiService.getDefaultSurveyScopesFilter(paymarketId)
            .pipe(
              mergeMap(response => [
                new fromSurveySearchFiltersActions.GetDefaultScopesFilterSuccess(),
                new fromSearchFiltersActions.AddFilterAndSelectAllOptions(
                  <MultiSelectFilter>this.payfactorsSearchApiModelMapper.mapSearchFilterToFilter(response))
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
