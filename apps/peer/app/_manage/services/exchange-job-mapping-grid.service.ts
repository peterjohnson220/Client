import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromPeerMainReducer from '../reducers';
import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';

@Injectable()
export class ExchangeJobMappingGridService {
  exchangeJobMappingsGridState$: Observable<any>;

  constructor(
    private store: Store<fromPeerMainReducer.State>
  ) {
    this.exchangeJobMappingsGridState$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsGridState);
  }

  loadExchangeJobMappings(): void {
    this.exchangeJobMappingsGridState$.pipe(take(1)).subscribe(gridState => {
      this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings());
    });
  }
}
