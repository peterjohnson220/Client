import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromExchangeExplorerReducer from '../reducers';
import { Filter, MultiSelectFilter } from '../../../search/models';
import { BaseExchangeDataSearchRequest } from '../../../../models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeDataSearchFilterContext } from '../../../../models/peer';
import { PayfactorsSearchApiHelper } from '../../../search/helpers';
@Injectable()
export class ExchangeExplorerContextService {

  selectFilterContext(): Observable<BaseExchangeDataSearchRequest> {
    const filterContext$ = this.store.pipe(select(fromExchangeExplorerReducer.getFilterContext));
    const mapFilter$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapFilter));
    const mapZoom$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapZoom));
    const searchFilters$ = this.searchStore.pipe(select(fromSearchReducer.getParentFilters));
    const childFilters$ = this.searchStore.pipe(select(fromSearchReducer.getChildFilters));
    const combinedFilterContext$ = combineLatest([filterContext$, mapFilter$, mapZoom$, searchFilters$, childFilters$]);

    return combinedFilterContext$.pipe(
      map((combined) => {
        const filterContext: ExchangeDataSearchFilterContext = {
          ...combined[0],
          ...combined[1],
          ZoomLevel: combined[2]
        };
        const searchFields = this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(combined[3]);
        const filters = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(combined[3]);
        const childFilters = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(combined[4]);
        const exchangeDataSearchRequest: BaseExchangeDataSearchRequest = {
          FilterContext: filterContext,
          Filters: filters.concat(childFilters),
          SearchFields: !!searchFields ? searchFields : []
        };
        return exchangeDataSearchRequest;
      })
    );
  }

  selectCountOfCompanyFiltersSelected(): Observable<number> {
    const searchFilters$: Observable<Filter[]> = this.searchStore.pipe(select(fromSearchReducer.getAllFilters));

    return searchFilters$.pipe(
      map((filters: Filter[]) => {

        const companyIdSelections = filters.filter((f: Filter) => f.BackingField === 'company_name').map((msf: MultiSelectFilter) => {
           return msf.Options.filter(o => o.Selected).map(x => {
            return x.Value.toString();
          });
        });
        const subsidiaryParentIdSelections = filters.filter((f: Filter) => f.BackingField === 'subsidiary_name').map((msf: MultiSelectFilter) => {
          return msf.Options.filter(o => o.Selected).map(x => JSON.parse(x.Value).ParentOptionValue);
        });
        const selections = !!companyIdSelections[0] && companyIdSelections[0].length ? companyIdSelections[0].concat(subsidiaryParentIdSelections[0]) : subsidiaryParentIdSelections[0];
        const numberOfSelections = new Set(!!selections ? selections : []).size;

        return numberOfSelections;
      })
    );
  }

  constructor(
    private store: Store<fromExchangeExplorerReducer.State>,
    private searchStore: Store<fromSearchReducer.State>,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper
  ) { }
}
