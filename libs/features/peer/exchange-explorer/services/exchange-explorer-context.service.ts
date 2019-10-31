import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromExchangeExplorerReducer from '../reducers';
import { Filter, MultiSelectFilter } from '../../../search/models';
import { BaseExchangeDataSearchRequest } from '../../../../models/payfactors-api/peer-exchange-explorer-search/request';
import { ExchangeDataSearchFilterContext } from '../../../../models/peer';
import { PayfactorsSearchApiHelper } from '../../../search/helpers';

@Injectable()
export class ExchangeExplorerContextService {

  selectFilterContext(): Observable<BaseExchangeDataSearchRequest> {
    const filterContext$ = this.store.pipe(select(fromExchangeExplorerReducer.getFilterContext));
    const mapFilter$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapFilter));
    const searchFilters$ = this.searchStore.pipe(select(fromSearchReducer.getFilters));
    const combinedFilterContext$ = combineLatest([filterContext$, mapFilter$, searchFilters$]);

    return combinedFilterContext$.pipe(
      map((combined) => {
        const filterContext: ExchangeDataSearchFilterContext = {
          ...combined[0],
          ...combined[1]
        };
        const searchFields = this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(combined[2]);
        const filters = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(combined[2]);
        const exchangeDataSearchRequest: BaseExchangeDataSearchRequest = {
          FilterContext: filterContext,
          Filters: filters,
          SearchFields: !!searchFields ? searchFields : []
        };
        return exchangeDataSearchRequest;
      })
    );
  }

  selectCountOfCompanyFiltersSelected(): Observable<number> {
    const searchFilters$: Observable<Filter[]> = this.searchStore.pipe(select(fromSearchReducer.getFilters));

    return searchFilters$.pipe(
      map((filters: Filter[]) => {
        return filters.filter((f: Filter) => f.BackingField === 'company_id').reduce<number>((val, f: MultiSelectFilter) => {
          const selectedOptions = f.Options.filter(o => o.Selected);
          const selectionCount = !!selectedOptions ? selectedOptions.length : 0;
          return val += selectionCount;
        }, 0);
      })
    );
  }

  constructor(
    private store: Store<fromExchangeExplorerReducer.State>,
    private searchStore: Store<fromSearchReducer.State>,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper
  ) { }
}
