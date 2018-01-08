import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeJob } from 'libs/models';

import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';

@Injectable()
export class ExchangeJobsEffects {

  @Effect()
  loadExchangeJobs$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobsActions.LOADING_EXCHANGE_JOBS)
    .map((action: fromExchangeJobsActions.LoadingExchangeJobs) => action.payload)
    .switchMap(exchangeId =>
      this.exchangeApiService.getExchangeJobs(exchangeId)
        .map((exchangeJobs: ExchangeJob[]) => new fromExchangeJobsActions.LoadingExchangeJobsSuccess(exchangeJobs))
        .catch(error => of(new fromExchangeJobsActions.LoadingExchangeJobsError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}


