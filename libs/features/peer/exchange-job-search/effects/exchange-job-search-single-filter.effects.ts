import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/search/helpers';
import { InfiniteScrollEffectsService} from 'libs/features/search/infinite-scroll/services';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { MultiSelectFilter } from 'libs/features/search/search/models';
import { ExchangeJobSearchApiService } from 'libs/data/payfactors-api';
import { SearchFilter } from 'libs/models/payfactors-api';
import * as fromSingledFilterActions from 'libs/features/search/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';

import * as fromExchangeJobSearchReducer from '../reducers';

@Injectable()
export class ExchangeJobSearchSingleFilterEffects {

  @Effect()
  searchEmployeeAggregations = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.SEARCH_SINGLED_FILTER).pipe(
    withLatestFrom(
      this.store.select(fromSearchReducer.getSingledFilter),
      this.store.select(fromSearchReducer.getParentFilters),
      this.store.select(fromSearchReducer.getSingledFilterSearchValue),
      this.store.select(fromExchangeJobSearchReducer.getExchangeId),
      this.store.select(fromSearchReducer.getSearchFeatureId),
      (
        infiniteScrollActionContext, singledFilter, filters,
       searchValue, exchangeId, searchFeatureId) => (
        {infiniteScrollActionContext, singledFilter, filters, searchValue, exchangeId, searchFeatureId}
      )),
    filter((data) => data.searchFeatureId === SearchFeatureIds.PeerExchangeJob),
    switchMap( data => {
      const request = {
        SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
        Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
        PagingOptions: data.infiniteScrollActionContext.pagingOptions,
        SearchField: data.singledFilter.BackingField,
        TextQuery: data.searchValue,
        ExchangeId: data.exchangeId
      };

      return this.exchangeJobSearchApiService.getMDJobExchangeJobSearchAggregationResults(request).pipe(
        map((response: SearchFilter) => {
          const matchingFilter = <MultiSelectFilter>data.filters.find(f => f.Id === data.singledFilter.Id);
          const currentSelections = matchingFilter.Options.filter(o => o.Selected);

          data.infiniteScrollActionContext.scrollSuccessful(this.store, response);

          return new fromSingledFilterActions.SetSingledFilterOptions(
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

  constructor(private store: Store<fromExchangeJobSearchReducer.State>,
              private infiniteScrollEffectsService: InfiniteScrollEffectsService,
              private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
              private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
              private exchangeJobSearchApiService: ExchangeJobSearchApiService) {
  }
}
