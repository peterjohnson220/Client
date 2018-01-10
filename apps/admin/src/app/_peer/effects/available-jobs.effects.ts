import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromAvailableJobsActions from '../actions/available-jobs.actions';
// TODO: import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';

@Injectable()
export class AvailableJobsEffects {

  @Effect()
  loadAvailableJobs$: Observable<Action> = this.actions$
    .ofType(fromAvailableJobsActions.LOADING_AVAILABLE_JOBS)
    .map((action: fromAvailableJobsActions.LoadingAvailableJobs) => action.payload)
    .switchMap(payload =>
      this.exchangeApiService.getAvailableJobs(payload)
        .map((availableJobsResult: GridDataResult) => new fromAvailableJobsActions
          .LoadingAvailableJobsSuccess(availableJobsResult))
        .catch(error => of(new fromAvailableJobsActions.LoadingAvailableJobsError()))
    );
// TODO: MOVE TO exchange-jobs effects when avail -
  @Effect()
  addExchangeJobs$: Observable<Action> = this.actions$
    .ofType(fromAvailableJobsActions.ADDING_EXCHANGE_JOBS)
    .map((action: fromAvailableJobsActions.AddingExchangeJobs) => action.payload)
    .switchMap(payload => this.exchangeApiService.addJobs(payload)
      .map(() => new fromAvailableJobsActions.AddingExchangeJobsSuccess)
      .catch(error => of(new fromAvailableJobsActions.AddingExchangeJobsError()))
    );
// .concatMap(() => {
//   return [
//     new fromAvailableJobsActions.AddingExchangeJobsSuccess,
//   // new fromAvailableJobsActions.LoadingExchangeJobs(payload.ExchangeId)
// ];
// })
  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}


