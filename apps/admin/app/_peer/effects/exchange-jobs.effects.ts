import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import { GridHelperService } from '../services/grid-helper.service';
import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';

@Injectable()
export class ExchangeJobsEffects {

  @Effect()
  loadExchangeJobs$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeJobsActions.LOADING_EXCHANGE_JOBS),
      map((action: fromExchangeJobsActions.LoadingExchangeJobs) => action.payload),
      switchMap(payload => {
          return this.exchangeApiService.getExchangeJobs(payload.exchangeId, payload.listState).pipe(
            map((exchangeJobsResult: GridDataResult) => new fromExchangeJobsActions
              .LoadingExchangeJobsSuccess(exchangeJobsResult)),
            catchError(error => of(new fromExchangeJobsActions.LoadingExchangeJobsError()))
          );
        }
      )
    );

  @Effect()
  addExchangeJobs$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeJobsActions.ADDING_EXCHANGE_JOBS),
      map((action: fromExchangeJobsActions.AddingExchangeJobs) => action.payload),
      switchMap((payload) => {
        return this.exchangeApiService.addJobs(payload).pipe(
          map(() => {
            this.gridHelperService.loadExchangeJobs(payload.ExchangeId);
            return new fromExchangeJobsActions.AddingExchangeJobsSuccess;
          }),
          catchError(error => of(new fromExchangeJobsActions.AddingExchangeJobsError()))
        );
      })
    );

  @Effect()
  exportExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobsActions.EXPORT_EXCHANGE_JOBS),
    map((action: fromExchangeJobsActions.ExportExchangeJobs) => action.payload),
    switchMap((payload) => {
      return this.exchangeApiService.exportExchangeJobs(payload.exchangeId).pipe(
        map(() => {
          return new fromExchangeJobsActions.ExportExchangeJobsSuccess;
        }),
        catchError(error => of(new fromExchangeJobsActions.ExportExchangeJobsError()))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}


