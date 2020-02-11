import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { SearchFilter, SearchSurveyAggregationsRequest } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { MultiSelectFilter } from 'libs/features/search/models';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromSurveySearchReducer from '../reducers';

@Injectable()
export class SingledFilterEffects {

  @Effect()
  searchSurveyAggregations = this.actions$
    .pipe(
      ofType(fromSingledFilterActions.SEARCH_AGGREGATION),
      withLatestFrom(
        this.store.select(fromSearchReducer.getSingledFilter),
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSearchReducer.getSingledFilterSearchValue),
        (action: fromSingledFilterActions.SearchAggregation, singledFilter, filters, context, searchValue) => (
          { action, singledFilter, filters, context, searchValue }
        )),
      switchMap(data => {
        const request: SearchSurveyAggregationsRequest = {
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
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
                newOptions: this.payfactorsSearchApiModelMapper.mapSearchFilterOptionsToMultiSelectOptions(response.Options),
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
    private store: Store<fromSurveySearchReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private surveySearchApiService: SurveySearchApiService
  ) {
  }
}
