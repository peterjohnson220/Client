import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromAvailableJobsActions from '../actions/available-jobs.actions';

@Injectable()
export class AvailableJobsEffects {

  @Effect()
  loadAvailableJobs$: Observable<Action> = this.actions$
    .ofType(fromAvailableJobsActions.LOADING_AVAILABLE_JOBS).pipe(
      map((action: fromAvailableJobsActions.LoadingAvailableJobs) => action.payload),
      switchMap(payload =>
        this.exchangeApiService.getAvailableJobs(payload.exchangeId, payload.listState).pipe(
          map((availableJobsResult: GridDataResult) => new fromAvailableJobsActions
            .LoadingAvailableJobsSuccess(availableJobsResult)),
          catchError(error => of(new fromAvailableJobsActions.LoadingAvailableJobsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}


