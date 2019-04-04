import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromPeerAdminReducer from '../reducers';
import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';
import * as fromExchangeAccessRequests from '../actions/exchange-access-requests.actions';
import * as fromPayfactorsCompanyExchangeInvitations from '../actions/payfactors-company-exchange-invitations.actions';
import * as fromNewCompanyExchangeInvitations from '../actions/new-company-exchange-invitations.actions';
import * as fromExchangeJobRequestsActions from '../actions/exchange-job-requests.actions';
import * as fromExchangeFiltersActions from '../actions/exchange-filters.actions';

@Injectable()
export class GridHelperService {
  exchangeJobsGridState$: Observable<any>;
  exchangeCompaniesGridState$: Observable<any>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.exchangeJobsGridState$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobsGridState));
    this.exchangeCompaniesGridState$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeCompaniesGridState));
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

  loadExchangeAccessRequests(exchangeId: number) {
    return this.store.dispatch(new fromExchangeAccessRequests.LoadExchangeAccessRequests(
      {
        exchangeId: exchangeId
      }
    ));
  }

  loadPayfactorsCompanyExchangeInvitations(exchangeId: number) {
    return this.store.dispatch(new fromPayfactorsCompanyExchangeInvitations.LoadPayfactorsCompanyExchangeInvitations(
      {
        exchangeId: exchangeId
      }
    ));
  }

  loadNewCompanyExchangeInvitations(exchangeId: number) {
    return this.store.dispatch(new fromNewCompanyExchangeInvitations.LoadNewCompanyExchangeInvitations(
      {
        exchangeId: exchangeId
      }
    ));
  }

  loadExchangeJobRequests(exchangeId: number) {
    return this.store.dispatch(new fromExchangeJobRequestsActions.LoadExchangeJobRequests(
      {
        exchangeId: exchangeId
      }
    ));
  }

  loadExchangeFilters(exchangeId: number, searchString: string) {
    return this.store.dispatch(new fromExchangeFiltersActions.LoadExchangeFilters(
      {
        exchangeId: exchangeId,
        searchString: searchString
      }
    ));
  }
}
