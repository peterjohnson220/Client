import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromAddDataReducer from '../reducers';
import { AddDataEffectsService } from '../services';

@Injectable()
export class SearchFiltersEffects {

  @Effect()
  updateStaticFilterValue$ = this.actions$
    .ofType(fromSearchFiltersActions.UPDATE_FILTER_VALUE)
    .pipe(
      map(() => new fromSearchResultsActions.GetResults())
    );


  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .ofType(fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER)
    .pipe(
      withLatestFrom(this.store.select(fromAddDataReducer.getJobContext), (action, jobContext) => jobContext),
      switchMap((jobContext) => {
          return this.surveySearchApiService.getDefaultSurveyScopesFilter(jobContext.PayMarketId)
            .pipe(
              map(response => new fromSearchFiltersActions.GetDefaultScopesFilterSuccess(response))
            );
        }
      )
    );

  constructor(
    private actions$: Actions,
    private surveySearchApiService: SurveySearchApiService,
    private addDataEffectsService: AddDataEffectsService,
    private store: Store<fromAddDataReducer.State>
  ) {
  }
}
