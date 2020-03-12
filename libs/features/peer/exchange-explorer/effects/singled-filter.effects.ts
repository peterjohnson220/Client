import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SearchFilter } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { MultiSelectFilter } from 'libs/features/search/models';
import { SearchExchangeAggregationsRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import { InfiniteScrollActionContext, InfiniteScrollEffectsService } from 'libs/features/infinite-scroll/services/infinite-scroll-effects.service';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import { ExchangeExplorerContextService } from '../services';


@Injectable()
export class SingledFilterEffects {

  @Effect()
  exchangeSearchAggregations$ = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.SEARCH_SINGLED_FILTER)
    .pipe(
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        this.searchStore.pipe(select(fromSearchReducer.getSingledFilter)),
        this.searchStore.pipe(select(fromSearchReducer.getSingledFilterSearchValue)),
        this.searchStore.pipe(select(fromSearchReducer.getParentFilters)),
        this.searchStore.pipe(select(fromSearchReducer.getChildFilters)),
        (infiniteScrollActionContext, filterContext, singledFilter, searchValue, filters, subFilters) => ({
          infiniteScrollActionContext, filterContext, singledFilter, searchValue, filters, subFilters
        })),
      switchMap(data => {
        const request: SearchExchangeAggregationsRequest = {
          ...data.filterContext,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue,
          PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.infiniteScrollActionContext.pagingOptions)
        };

        const subFilters = data.subFilters;

        return this.exchangeDataSearchApiService.searchExchangeAggregations(request).pipe(
          map((response: SearchFilter) => {
            const matchingFilter = <MultiSelectFilter>data.filters.find(f => f.Id === data.singledFilter.Id);
            const currentSelections = matchingFilter.Options.filter(o => o.Selected);

            data.infiniteScrollActionContext.scrollSuccessful(this.searchStore, response);

            return new fromSingledFilterActions.SetSingledFilterOptions(
              {
                newOptions: this.payfactorsSearchApiModelMapper.mapSearchFilterOptionsToFilterableMultiSelectOptions(response.Options),
                currentSelections,
                subFilters,
                replaceClientOptions: data.infiniteScrollActionContext.isLoadAction
              }
            );
          }),
          catchError(() => data.infiniteScrollActionContext.throwError())
        );
      })
    );

  constructor(
    private searchStore: Store<fromSearchReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private infiniteScrollEffectsService: InfiniteScrollEffectsService
  ) {
  }
}
