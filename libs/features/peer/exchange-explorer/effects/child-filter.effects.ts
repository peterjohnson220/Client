import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { SearchExchangeAggregationsRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { SearchFilter, SearchFilterOption } from 'libs/models/payfactors-api/search/response';
import { MultiSelectFilter } from 'libs/features/search/search/models';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { InfiniteScrollEffectsService } from 'libs/features/search/infinite-scroll/services';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromChildFilterActions from 'libs/features/search/search/actions/child-filter.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';

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
      this.searchStore.pipe(select(fromSearchReducer.getSearchFeatureId)),
      (infiniteScrollActionContext, filterContext, singledFilter, searchValue, subFilters, parentFilters, parentOptionValue, searchFeatureId) => ({
        infiniteScrollActionContext, filterContext, singledFilter, searchValue, subFilters, parentFilters, parentOptionValue, searchFeatureId
      })),
      filter((data) => data.searchFeatureId === SearchFeatureIds.ExchangeExplorer),
      switchMap(data => {
        const request: SearchExchangeAggregationsRequest = {
          ...data.filterContext,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue,
          PagingOptions: data.infiniteScrollActionContext.pagingOptions
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
