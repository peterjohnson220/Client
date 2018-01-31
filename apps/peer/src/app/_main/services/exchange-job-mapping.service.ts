import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromPeerMainReducer from '../reducers';
import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';

@Injectable()
export class ExchangeJobMappingService {
  exchangeJobMappingsGridStateAndQuery$: Observable<any>;

  constructor(
    private store: Store<fromPeerMainReducer.State>
  ) {
    this.exchangeJobMappingsGridStateAndQuery$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingGridStateAndQuery);
  }

  loadExchangeJobMappings(exchangeId: number): void {
    this.exchangeJobMappingsGridStateAndQuery$.take(1).subscribe(gridStateAnyQuery => {
      this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings(
        {
          exchangeId: exchangeId,
          listState: gridStateAnyQuery.gridState,
          query: gridStateAnyQuery.query
        }
      ));
    });
  }

  loadExchangeJobMappingsAfterMap(exchangeId: number): void {
    this.exchangeJobMappingsGridStateAndQuery$.take(1).subscribe(gridStateAnyQuery => {
      this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(
        {
          exchangeId: exchangeId,
          listState: gridStateAnyQuery.gridState,
          query: gridStateAnyQuery.query
        }
      ));
    });
  }
}
