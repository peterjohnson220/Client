import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
import { SearchFilter, SearchSurveyAggregationsRequest } from 'libs/models/survey-search';

import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import * as fromAddDataReducer from '../reducers';
import { mapFiltersToSearchFields, mapFiltersToSearchFilters } from '../helpers';

@Injectable()
export class SingledFilterEffects {

  @Effect()
  searchSurveyAggregations = this.actions$
    .ofType(fromSingledFilterActions.SEARCH_AGGREGATION)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getSingledFilter),
        this.store.select(fromAddDataReducer.getFilters),
        this.store.select(fromAddDataReducer.getJobContext),
        (action: fromSingledFilterActions.SearchAggregation, singledFilter, filters, context) => (
          { action, singledFilter, filters, context }
        )),
      switchMap(data => {
        const request: SearchSurveyAggregationsRequest = {
          SearchFields: mapFiltersToSearchFields(data.filters),
          Filters: mapFiltersToSearchFilters(data.filters),
          CountryCode: data.context.CountryCode,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.action.payload
        };

        return this.surveySearchApiService.searchSurveyAggregations(request).pipe(
          map((response: SearchFilter) => new fromSingledFilterActions.SearchAggregationSuccess(response.Options))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromAddDataReducer.State>,
    private surveySearchApiService: SurveySearchApiService
  ) {
  }
}
