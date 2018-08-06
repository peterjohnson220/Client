import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SearchResponse } from 'libs/models/survey-search';
import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import {
  mapFiltersToSearchFilters,
  mapResultsPagingOptionsToPagingOptions,
  mapFiltersToSearchFields
} from '../helpers';
import * as fromAddDataReducer from '../reducers';

@Injectable()
export class AddDataEffectsService {

  searchSurveyJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromAddDataReducer.getFilters),
        this.store.select(fromAddDataReducer.getResultsPagingOptions),
        this.store.select(fromAddDataReducer.getJobContext),
        (action, filters, pagingOptions, jobContext) => ({ filters, pagingOptions, jobContext })),


      switchMap(filtersAndPaging => {
        // Build up request objects
        const searchFieldsRequestObj = mapFiltersToSearchFields(filtersAndPaging.filters);
        const filtersRequestObj = mapFiltersToSearchFilters(filtersAndPaging.filters);
        const pagingOptionsRequestObj = mapResultsPagingOptionsToPagingOptions(filtersAndPaging.pagingOptions);
        const filterOptionsRequestObj = { ReturnFilters: true, AggregateCount: 5 };

        return this.surveySearchApiService.searchSurveyJobs({
          SearchFields: searchFieldsRequestObj,
          Filters: filtersRequestObj,
          FilterOptions: filterOptionsRequestObj,
          PagingOptions: pagingOptionsRequestObj,
          CurrencyCode: filtersAndPaging.jobContext.CurrencyCode
        })
          .pipe(
            map((searchResponse: SearchResponse) => {
              return pagingOptionsRequestObj.From > 0
                ? new fromSearchResultsActions.GetMoreResultsSuccess(searchResponse)
                : new fromSearchResultsActions.GetResultsSuccess(searchResponse);
            })
          );
      })
    );
  }

  constructor(
    private store: Store<fromAddDataReducer.State>,
    private surveySearchApiService: SurveySearchApiService
  ) {
  }
}
