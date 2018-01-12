import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';
import { GridHelperService } from '../services/grid-helper.service';

@Injectable()
export class ExchangeJobsEffects {

  @Effect()
  loadExchangeJobs$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobsActions.LOADING_EXCHANGE_JOBS)
    .map((action: fromExchangeJobsActions.LoadingExchangeJobs) => action.payload)
    .switchMap(payload => {
        return this.exchangeApiService.getExchangeJobs(payload)
          .map((exchangeJobsResult: GridDataResult) => new fromExchangeJobsActions
            .LoadingExchangeJobsSuccess(exchangeJobsResult))
          .catch(error => of(new fromExchangeJobsActions.LoadingExchangeJobsError()));
      }
    );

  @Effect()
  addExchangeJobs$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobsActions.ADDING_EXCHANGE_JOBS)
    .map((action: fromExchangeJobsActions.AddingExchangeJobs) => action.payload)
    .switchMap((payload) => {
      return this.exchangeApiService.addJobs(payload)
        .map(() => {
          this.gridHelperService.loadExchangeJobs(payload.ExchangeId);
          return new fromExchangeJobsActions.AddingExchangeJobsSuccess;
        })
        .catch(error => of(new fromExchangeJobsActions.AddingExchangeJobsError()));
    });

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}


