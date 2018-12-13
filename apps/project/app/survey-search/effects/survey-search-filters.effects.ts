import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSavedFiltersActions from 'libs/features/search/actions/saved-filters.actions';
import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { MultiSelectFilter } from 'libs/features/search/models';

import * as fromSurveySearchFiltersActions from '../actions/survey-search-filters.actions';
import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import * as fromSurveySearchReducer from '../reducers';

@Injectable()
export class SurveySearchFiltersEffects {

  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .ofType(fromSurveySearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER)
    .pipe(
      withLatestFrom(this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action, projectSearchContext) => projectSearchContext),
      switchMap((projectSearchContext) => {
          return this.surveySearchApiService.getDefaultSurveyScopesFilter(projectSearchContext.PayMarketId)
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
    .ofType(fromSurveySearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS)
    .pipe(
      map(() => new fromSavedFiltersActions.InitSavedFilters())
    );

  @Effect()
  resetAllFilters$ = this.actions$
    .ofType(fromSearchFiltersActions.RESET_ALL_FILTERS)
    .pipe(
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
