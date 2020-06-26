import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { SearchExchangeAggregationsRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { SearchFilter, SearchFilterOption } from 'libs/models/payfactors-api/search/response';
import { MultiSelectFilter } from 'libs/features/search/models';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import { InfiniteScrollActionContext, InfiniteScrollEffectsService } from 'libs/features/infinite-scroll/services';
import * as fromChildFilterActions from 'libs/features/search/actions/child-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import { ExchangeExplorerContextService } from '../services';

@Injectable()
export class ChildFilterEffects {
  @Effect()
  exchangeSearchAggregations$ = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.SEARCH_CHILD_FILTER).pipe(
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      this.searchStore.pipe(select(fromSearchReducer.getChildFilter)),
      this.searchStore.pipe(select(fromSearchReducer.getChildFilterSearchValue)),
      this.searchStore.pipe(select(fromSearchReducer.getChildFilters)),
      this.searchStore.pipe(select(fromSearchReducer.getParentFilters)),
      this.searchStore.pipe(select(fromSearchReducer.getChildFilterParentOptionValue)),
      (infiniteScrollActionContext, filterContext, singledFilter, searchValue, subFilters, parentFilters, parentOptionValue) => ({
        infiniteScrollActionContext, filterContext, singledFilter, searchValue, subFilters, parentFilters, parentOptionValue
      })),
      switchMap(data => {
        const request: SearchExchangeAggregationsRequest = {
          ...data.filterContext,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue,
          PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.infiniteScrollActionContext.pagingOptions)
        };

        const parentSearchFilterOption: SearchFilterOption = {
          Name: '',
          Value: data.parentOptionValue
        };

        const parentSearchFilter: SearchFilter = {
          Name: data.singledFilter.ParentBackingField,
          Options: [parentSearchFilterOption],
          DisplayName: data.singledFilter.ParentBackingField.replace('_', ' ')
        };

        request.Filters = request.Filters.filter(f => f.Name !== data.singledFilter.ParentBackingField);
        request.Filters = request.Filters.concat(parentSearchFilter);

        return this.exchangeDataSearchApiService.searchExchangeAggregations(request).pipe(
          map((response: SearchFilter) => {

            data.infiniteScrollActionContext.scrollSuccessful(this.searchStore, response);
            const matchingFilter = <MultiSelectFilter>data.subFilters.find(f => f.Id === data.singledFilter.Id);
            const currentSelections = matchingFilter.Options.filter(o => o.Selected);

            return new fromChildFilterActions.SetChildFilterOptions(
              {
                newOptions: this.payfactorsSearchApiModelMapper.mapSearchFilterOptionsToMultiSelectOptions(response.Options),
                currentSelections,
                replaceClientOptions: data.infiniteScrollActionContext.isLoadAction
              }
            );
          }),
          catchError(() => data.infiniteScrollActionContext.throwError())
        );
      })
  );

  constructor(
    private actions$: Actions,
    private searchStore: Store<fromSearchReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private infiniteScrollEffectsService: InfiniteScrollEffectsService
  ) {
  }
}
