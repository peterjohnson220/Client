import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
import { SearchFilter, SearchSurveyAggregationsRequest } from 'libs/models/survey-search';

import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import * as fromAddDataReducer from '../reducers';
import { mapFiltersToSearchFields, mapFiltersToSearchFilters } from '../helpers';
import { isMultiFilter, MultiSelectFilter } from '../models';

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

          map((response: SearchFilter) => {
            const matchingFilter = <MultiSelectFilter>data.filters.find(f => f.Id === data.singledFilter.Id);
            const currentSelections = matchingFilter.Options.filter(o => o.Selected);

            return new fromSingledFilterActions.SearchAggregationSuccess(
              {
                newOptions: response.Options,
                currentSelections
              }
            );
          })
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
