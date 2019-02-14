import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { JobAssociationApiService } from 'libs/data/payfactors-api/peer/job-association-api.service';

import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';
import * as fromReducer from '../reducers';

@Injectable()
export class ExchangeJobsEffects {

  @Effect()
  loadExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobsActions.LOAD_EXCHANGE_JOBS),
    // grab list state
    withLatestFrom(
      this.store.pipe(
        select(fromReducer.getExchangeJobsGridState)),
        (action, listState) => listState
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined =>
      this.jobAssociationApiService.loadExchangeJobs(combined.grid).pipe(
        map((grid) => new fromExchangeJobsActions.LoadExchangeJobsSuccess(grid)),
        catchError(() => of(new fromExchangeJobsActions.LoadExchangeJobsError())
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private jobAssociationApiService: JobAssociationApiService,
    private store: Store<fromReducer.State>,
  ) {}
}
