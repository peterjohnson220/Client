import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromPeerAdminReducer from '../reducers';
import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';
import * as fromPendingExchangeAccessRequests from '../actions/pending-exchange-access-requests.actions';

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
    this.exchangeJobsGridState$.pipe(take(1)).subscribe(gridState => {
      return this.store.dispatch(new fromExchangeJobsActions.LoadingExchangeJobs(
        {
          exchangeId: exchangeId,
          listState: gridState
        }
      ));
    });
  }

  loadExchangeCompanies(exchangeId: number) {
    this.exchangeCompaniesGridState$.pipe(take(1)).subscribe(gridState => {
      return this.store.dispatch(new fromExchangeCompaniesActions.LoadingExchangeCompanies(
        {
          exchangeId: exchangeId,
          listState: gridState
        }
      ));
    });
  }

  loadPendingExchangeAccessRequests(exchangeId: number) {
    return this.store.dispatch(new fromPendingExchangeAccessRequests.LoadPendingExchangeAccessRequests(
      {
        exchangeId: exchangeId
      }
    ));
  }
}
