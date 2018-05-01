import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromPeerMainReducer from '../reducers';
import * as fromExchangeJobMappingGridActions from '../../_manage/actions/exchange-job-mapping-grid.actions';

@Injectable()
export class ExchangeJobMappingService {
  exchangeJobMappingsGridState$: Observable<any>;

  constructor(
    private store: Store<fromPeerMainReducer.State>
  ) {
    this.exchangeJobMappingsGridState$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsGridState);
  }

  loadExchangeJobMappings(exchangeId: number): void {
    this.exchangeJobMappingsGridState$.take(1).subscribe(gridState => {
      this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings(
        {
          exchangeId: exchangeId,
          listState: gridState
        }
      ));
    });
  }

  loadExchangeJobMappingsAfterMap(exchangeId: number): void {
    this.exchangeJobMappingsGridState$.take(1).subscribe(gridState => {
      this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(
        {
          exchangeId: exchangeId,
          listState: gridState
        }
      ));
    });
  }
}
