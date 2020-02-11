import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SearchFilter } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { MultiSelectFilter } from 'libs/features/search/models';
import { SearchExchangeAggregationsRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import { ExchangeExplorerContextService } from '../services';

@Injectable()
export class SingledFilterEffects {

  @Effect()
  exchangeSearchAggregations$ = this.actions$
    .pipe(
      ofType(fromSingledFilterActions.SEARCH_AGGREGATION),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        this.searchStore.pipe(select(fromSearchReducer.getSingledFilter)),
        this.searchStore.pipe(select(fromSearchReducer.getSingledFilterSearchValue)),
        this.searchStore.pipe(select(fromSearchReducer.getParentFilters)),
        this.searchStore.pipe(select(fromSearchReducer.getSubFilters)),
        (action, filterContext, singledFilter, searchValue, filters, subFilters) => ({
          filterContext, singledFilter, searchValue, filters, subFilters
        })),
      switchMap(data => {
        const request: SearchExchangeAggregationsRequest = {
          ...data.filterContext,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue
        };

        const subFilters = data.subFilters;

        return this.exchangeDataSearchApiService.searchExchangeAggregations(request).pipe(
          map((response: SearchFilter) => {
            const matchingFilter = <MultiSelectFilter>data.filters.find(f => f.Id === data.singledFilter.Id);
            const currentSelections = matchingFilter.Options.filter(o => o.Selected);

            return new fromSingledFilterActions.SearchAggregationSuccess(
              {
                newOptions: this.payfactorsSearchApiModelMapper.mapSearchFilterOptionsToFilterableMultiSelectOptions(response.Options),
                currentSelections,
                subFilters
              }
            );
          }),
          catchError(() => of(new fromSingledFilterActions.SearchAggregationError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private searchStore: Store<fromSearchReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {
  }
}
