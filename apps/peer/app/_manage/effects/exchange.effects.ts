import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

import * as fromSharedPeerExchangeActions from '../../shared/actions/exchange.actions';
import * as fromCompanyJobsActions from '../actions/company-jobs.actions';
import * as fromExchangeCompanyJobActions from '../actions/exchange-job-mapping-grid.actions'
@Injectable()
export class ExchangeEffects {
  @Effect()
  loadExchangeSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedPeerExchangeActions.LOAD_EXCHANGE_SUCCESS),
      filter((action: fromSharedPeerExchangeActions.LoadExchangeSuccess) => action.payload.path === 'manage'),
      mergeMap((action: fromSharedPeerExchangeActions.LoadExchangeSuccess) => [
        new fromCompanyJobsActions.Reset(),
        new fromCompanyJobsActions.SetExchangeId(action.payload.exchange.ExchangeId),
        new fromCompanyJobsActions.UpdateCompanyJobsSearchTerm(''),
        new fromCompanyJobsActions.LoadCompanyJobs(),
        new fromExchangeCompanyJobActions.LoadExchangeJobMappings()
      ])
    );

  constructor(
    private actions$: Actions
  ) { }
}


