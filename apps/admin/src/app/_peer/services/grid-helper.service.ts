import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromPeerAdminReducer from '../reducers';
import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';

@Injectable()
export class GridHelperService {
  exchangeJobsGridState$: Observable<any>;
  exchangeCompaniesGridState$: Observable<any>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.exchangeJobsGridState$ = this.store.select(fromPeerAdminReducer.getExchangeJobsGridState);
    this.exchangeCompaniesGridState$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesGridState);
  }

  loadExchangeJobs(exchangeId: number) {
    this.exchangeJobsGridState$.take(1).subscribe(gridState => {
      return this.store.dispatch(new fromExchangeJobsActions.LoadingExchangeJobs(
        {
          exchangeId: exchangeId,
          listState: gridState
        }
      ));
    });
  }

  loadExchangeCompanies(exchangeId: number) {
    this.exchangeCompaniesGridState$.take(1).subscribe(gridState => {
      return this.store.dispatch(new fromExchangeCompaniesActions.LoadingExchangeCompanies(
        {
          exchangeId: exchangeId,
          listState: gridState
        }
      ));
    });
  }
}
