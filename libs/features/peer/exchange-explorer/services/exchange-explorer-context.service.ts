import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromExchangeExplorerReducer from '../reducers';

@Injectable()
export class ExchangeExplorerContextService {

  selectFilterContext(): Observable<any> {
    const filterContext$ = this.store.pipe(select(fromExchangeExplorerReducer.getFilterContext));
    const mapFilter$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapFilter));
    const searchFilters$ = this.searchStore.pipe(select(fromSearchReducer.getFilters));
    const combinedFilterContext$ = combineLatest([filterContext$, mapFilter$, searchFilters$]);

    return combinedFilterContext$.pipe(
      map((combined) => {
        return {
          filterContext: combined[0],
          mapFilter: combined[1],
          searchFilters: combined[2]
        };
      })
    );
  }

  constructor(
    private store: Store<fromExchangeExplorerReducer.State>,
    private searchStore: Store<fromSearchReducer.State>
  ) { }
}
