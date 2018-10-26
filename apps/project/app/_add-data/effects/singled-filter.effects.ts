import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
import { SearchFilter, SearchSurveyAggregationsRequest } from 'libs/models/survey-search';

import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import * as fromAddDataReducer from '../reducers';
import { mapFiltersToSearchFields, getSelectedSearchFilters } from '../helpers';
import { MultiSelectFilter } from '../models';

@Injectable()
export class SingledFilterEffects {

  @Effect()
  searchSurveyAggregations = this.actions$
    .ofType(fromSingledFilterActions.SEARCH_AGGREGATION)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getSingledFilter),
        this.store.select(fromAddDataReducer.getFilters),
        this.store.select(fromAddDataReducer.getProjectSearchContext),
        this.store.select(fromAddDataReducer.getSingledFilterSearchValue),
        (action: fromSingledFilterActions.SearchAggregation, singledFilter, filters, context, searchValue) => (
          { action, singledFilter, filters, context, searchValue }
        )),
      switchMap(data => {
        const request: SearchSurveyAggregationsRequest = {
          SearchFields: mapFiltersToSearchFields(data.filters),
          Filters: getSelectedSearchFilters(data.filters),
          CountryCode: data.context.CountryCode,
          CurrencyCode: data.context.CurrencyCode,
          ProjectId: data.context.ProjectId,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue
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
          }),
          catchError(() => of(new fromSingledFilterActions.SearchAggregationError()))
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
